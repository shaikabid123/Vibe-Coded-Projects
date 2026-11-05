import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  employee_count: z.number().int().positive(),
  budget_per_employee_monthly: z.number().nonnegative(),
  risk_profile: z.enum(["low", "medium", "high"]),
  notes: z.string().max(500).optional(),
});

export const recommendPlan = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY missing");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: plans } = await supabaseAdmin
      .from("insurance_plans")
      .select("name,tier,monthly_premium,coverage_amount,benefits,maternity_coverage")
      .eq("is_active", true);

    const prompt = `You are a group health insurance advisor. Given the available plans and the company's profile, recommend ONE plan and a short rationale.\n\nAvailable plans (JSON):\n${JSON.stringify(plans, null, 2)}\n\nCompany profile:\n- Employees: ${data.employee_count}\n- Budget per employee per month (INR): ${data.budget_per_employee_monthly}\n- Risk profile: ${data.risk_profile}\n- Notes: ${data.notes ?? "none"}\n\nRespond strictly in this JSON shape:\n{\n  "recommended_plan_name": "string (must match one of the plan names)",\n  "rationale": "2-3 sentence explanation",\n  "estimated_annual_cost_inr": number,\n  "alternative": "name of a second-best plan"\n}`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "content-type": "application/json", "Lovable-API-Key": apiKey },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      }),
    });
    if (!res.ok) {
      const txt = await res.text();
      if (res.status === 429) throw new Error("AI rate-limited. Try again shortly.");
      if (res.status === 402) throw new Error("AI credits exhausted. Please top up.");
      throw new Error("AI request failed: " + txt.slice(0, 200));
    }
    const json = await res.json() as { choices?: { message?: { content?: string } }[] };
    const content = json.choices?.[0]?.message?.content ?? "{}";
    try {
      return JSON.parse(content) as {
        recommended_plan_name: string; rationale: string; estimated_annual_cost_inr: number; alternative: string;
      };
    } catch {
      return { recommended_plan_name: "", rationale: content, estimated_annual_cost_inr: 0, alternative: "" };
    }
  });