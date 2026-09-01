import type { EvaluateResponse, LoanFormValues } from "./types";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export async function evaluateLoan(values: LoanFormValues): Promise<EvaluateResponse> {
  const response = await fetch(`${API_BASE}/api/loan/evaluate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      monthlyIncome: Number(values.monthlyIncome),
      existingEmi: Number(values.existingEmi || 0),
      creditScore: Number(values.creditScore),
      employmentType: values.employmentType,
      loanAmount: Number(values.loanAmount),
      tenureMonths: Number(values.tenureMonths),
    }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || "Something went wrong evaluating your loan.");
  }

  return response.json();
}
