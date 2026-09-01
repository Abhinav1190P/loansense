export type EmploymentType = "salaried" | "self_employed";

export interface LoanFormValues {
  monthlyIncome: string;
  existingEmi: string;
  creditScore: string;
  employmentType: EmploymentType;
  loanAmount: string;
  tenureMonths: string;
}

export type DecisionStatus = "approved" | "conditionally_approved" | "under_review" | "declined";

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

export interface EvaluateResponse {
  decision: LoanDecision;
  explanation: string;
}
