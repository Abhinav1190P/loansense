import { DecisionStatus } from "../types";

interface CreditTier {
  status: DecisionStatus;
  interestRate: number | null;
  label: string;
}

export function getCreditTier(creditScore: number): CreditTier {
  if (creditScore >= 750) {
    return { status: "approved", interestRate: 10.5, label: "prime credit score" };
  }
  if (creditScore >= 700) {
    return { status: "conditionally_approved", interestRate: 12, label: "good credit score" };
  }
  if (creditScore >= 650) {
    return { status: "under_review", interestRate: 14, label: "fair credit score" };
  }
  return { status: "declined", interestRate: null, label: "credit score below our minimum threshold" };
}

export const FOIR_LIMIT = 0.5;

const STATUS_SEVERITY: Record<DecisionStatus, number> = {
  approved: 0,
  conditionally_approved: 1,
  under_review: 2,
  declined: 3,
};

export function worseStatus(a: DecisionStatus, b: DecisionStatus): DecisionStatus {
  return STATUS_SEVERITY[a] >= STATUS_SEVERITY[b] ? a : b;
}
