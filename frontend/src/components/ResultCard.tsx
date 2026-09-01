import type { LoanDecision } from "../types";

const STATUS_COPY: Record<LoanDecision["status"], { label: string; tone: string }> = {
  approved: { label: "Approved", tone: "good" },
  conditionally_approved: { label: "Conditionally approved", tone: "ok" },
  under_review: { label: "Under review", tone: "warn" },
  declined: { label: "Declined", tone: "bad" },
};

function formatRupees(value: number | null) {
  if (value === null) return "—";
  return `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

interface Props {
  decision: LoanDecision;
  explanation: string;
}

export default function ResultCard({ decision, explanation }: Props) {
  const status = STATUS_COPY[decision.status];

  return (
    <div className={`result-card tone-${status.tone}`}>
      <div className="result-header">
        <span className="status-pill">{status.label}</span>
        <span className="foir-note">
          {Math.round(decision.foir * 100)}% of your income would go toward EMIs (we cap this at 50%)
        </span>
      </div>

      {decision.emi !== null && (
        <div className="result-numbers">
          <div>
            <span className="number-label">Interest rate</span>
            <span className="number-value">{decision.interestRate}% p.a.</span>
          </div>
          <div>
            <span className="number-label">Monthly EMI</span>
            <span className="number-value">{formatRupees(decision.emi)}</span>
          </div>
          <div>
            <span className="number-label">Total interest</span>
            <span className="number-value">{formatRupees(decision.totalInterestPayable)}</span>
          </div>
          <div>
            <span className="number-label">Total repayment</span>
            <span className="number-value">{formatRupees(decision.totalRepayment)}</span>
          </div>
        </div>
      )}

      <div className="explanation">
        <h3>What this means for you</h3>
        <p>{explanation}</p>
      </div>
    </div>
  );
}
