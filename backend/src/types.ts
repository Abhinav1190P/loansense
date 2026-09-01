export type EmploymentType = "salaried" | "self_employed";

export interface LoanApplication {
  monthlyIncome: number;
  existingEmi: number;
  creditScore: number;
  employmentType: EmploymentType;
  loanAmount: number;
  tenureMonths: number;
}

export type DecisionStatus =
  | "approved"
  | "conditionally_approved"
  | "under_review"
  | "declined";

export interface ScheduleRow {
  month: number;
  openingBalance: number;
  emi: number;
  principalPaid: number;
  interestPaid: number;
  closingBalance: number;
}

export interface LoanDecision {
  status: DecisionStatus;
  reason: string;
  interestRate: number | null;
  emi: number | null;
  foir: number;
  totalInterestPayable: number | null;
  totalRepayment: number | null;
  schedule: ScheduleRow[];
}
