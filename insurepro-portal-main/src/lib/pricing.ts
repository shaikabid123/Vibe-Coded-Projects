export type MedicalFlags = {
  diabetes?: boolean;
  hypertension?: boolean;
  heart_disease?: boolean;
  asthma?: boolean;
  cancer_history?: boolean;
  smoking?: boolean;
  alcohol?: boolean;
  pregnancy?: boolean;
};

/**
 * Annual premium calculation:
 *   base = monthly_premium * 12 * employee_count
 *   risk_loading = base * (sum of per-condition factors, capped at 0.6)
 *   tax = 18% GST on (base + risk_loading)
 */
export function calculatePremium(
  monthlyPremium: number,
  employees: { dob?: string | null; medical?: MedicalFlags }[],
) {
  const count = employees.length;
  const base = monthlyPremium * 12 * count;

  let riskFactor = 0;
  for (const emp of employees) {
    const m = emp.medical ?? {};
    const age = emp.dob ? Math.floor((Date.now() - new Date(emp.dob).getTime()) / (365.25 * 24 * 3600 * 1000)) : 30;
    if (age >= 50) riskFactor += 0.03;
    else if (age >= 40) riskFactor += 0.015;
    if (m.diabetes) riskFactor += 0.04;
    if (m.hypertension) riskFactor += 0.03;
    if (m.heart_disease) riskFactor += 0.08;
    if (m.asthma) riskFactor += 0.02;
    if (m.cancer_history) riskFactor += 0.1;
    if (m.smoking) riskFactor += 0.04;
    if (m.pregnancy) riskFactor += 0.05;
  }
  // Average per employee, then cap
  const avgRisk = count > 0 ? Math.min(0.6, riskFactor / count) : 0;
  const riskLoading = Math.round(base * avgRisk);
  const tax = Math.round((base + riskLoading) * 0.18);
  const total = base + riskLoading + tax;
  return { base: Math.round(base), riskLoading, tax, total, employeeCount: count };
}