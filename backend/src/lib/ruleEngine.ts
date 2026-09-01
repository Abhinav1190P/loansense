import { LoanApplication, LoanDecision } from "../types";
import { calculateEmi, calculateFoir, buildRepaymentSchedule, totalInterestAndRepayment } from "./loanMath";
import { getCreditTier, FOIR_LIMIT, worseStatus } from "./creditPolicy";

export function evaluateLoan(application: LoanApplication): LoanDecision {
  const tier = getCreditTier(application.creditScore);

  if (tier.interestRate === null) {
    return {
      status: "declined",
      reason: `Your credit score of ${application.creditScore} is below our minimum of 650.`,
      interestRate: null,
      emi: null,
      foir: calculateFoir(application.existingEmi, 0, application.monthlyIncome),
      totalInterestPayable: null,
      totalRepayment: null,
      schedule: [],
    };
  }

  const emi = calculateEmi(application.loanAmount, tier.interestRate, application.tenureMonths);
  const foir = calculateFoir(application.existingEmi, emi, application.monthlyIncome);
  const foirBreached = foir > FOIR_LIMIT;

  const status = foirBreached ? worseStatus(tier.status, "declined") : tier.status;

  const reason = foirBreached
    ? `Combining your existing EMIs with a new EMI of ₹${emi.toFixed(0)} pushes your FOIR to ${(foir * 100).toFixed(1)}%, above our ${FOIR_LIMIT * 100}% limit.`
    : `Based on your ${tier.label} and a FOIR of ${(foir * 100).toFixed(1)}%, your application is ${statusLabel(tier.status)}.`;

  if (status === "declined") {
    return {
      status,
      reason,
      interestRate: tier.interestRate,
      emi: null,
      foir,
      totalInterestPayable: null,
      totalRepayment: null,
      schedule: [],
    };
  }

  const { totalRepayment, totalInterest } = totalInterestAndRepayment(
    application.loanAmount,
    tier.interestRate,
    application.tenureMonths
  );

  return {
    status,
    reason,
    interestRate: tier.interestRate,
    emi,
    foir,
    totalInterestPayable: totalInterest,
    totalRepayment,
    schedule: buildRepaymentSchedule(application.loanAmount, tier.interestRate, application.tenureMonths, 12),
  };
}

function statusLabel(status: string) {
  switch (status) {
    case "approved":
      return "approved";
    case "conditionally_approved":
      return "conditionally approved, at a higher rate";
    case "under_review":
      return "flagged for manual review";
    default:
      return status;
  }
}
