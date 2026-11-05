import { supabase } from "@/integrations/supabase/client";

export async function getMyCompanyId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("companies").select("id").eq("owner_id", user.id).maybeSingle();
  return data?.id ?? null;
}