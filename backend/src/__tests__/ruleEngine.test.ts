import { describe, it, expect } from "vitest";
import { evaluateLoan } from "../lib/ruleEngine";
import { calculateEmi } from "../lib/loanMath";

const baseApplication = {
  monthlyIncome: 80000,
  existingEmi: 0,
  creditScore: 800,
  employmentType: "salaried" as const,
  loanAmount: 500000,
  tenureMonths: 36,
};

describe("evaluateLoan", () => {
  it("approves a strong applicant with zero existing obligations", () => {
    const decision = evaluateLoan(baseApplication);
    expect(decision.status).toBe("approved");
    expect(decision.emi).not.toBeNull();
    expect(decision.schedule.length).toBe(12);
  });

  it("declines outright below the credit score floor, without touching EMI math", () => {
    const decision = evaluateLoan({ ...baseApplication, creditScore: 500 });
    expect(decision.status).toBe("declined");
    expect(decision.emi).toBeNull();
    expect(decision.reason).toMatch(/credit score/i);
  });

  it("declines a high credit score applicant whose FOIR blows past 50%", () => {
    const decision = evaluateLoan({
      ...baseApplication,
      monthlyIncome: 30000,
      existingEmi: 10000,
      loanAmount: 2000000,
      tenureMonths: 60,
    });
    expect(decision.status).toBe("declined");
    expect(decision.reason).toMatch(/FOIR/i);
  });

  it("passes an applicant sitting exactly on the 50% FOIR limit", () => {
    const emi = calculateEmi(120000, 10.5, 12);
    const decision = evaluateLoan({
      ...baseApplication,
      loanAmount: 120000,
      tenureMonths: 12,
      existingEmi: 0,
      monthlyIncome: emi * 2,
    });
    expect(decision.status).not.toBe("declined");
  });

  it("flags a 690 score as under review with a fallback rate", () => {
    const decision = evaluateLoan({ ...baseApplication, creditScore: 690 });
    expect(decision.status).toBe("under_review");
    expect(decision.interestRate).toBe(14);
  });
});
