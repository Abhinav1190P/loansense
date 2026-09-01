import { useState } from "react";
import type { LoanFormValues } from "../types";

const initialValues: LoanFormValues = {
  monthlyIncome: "",
  existingEmi: "",
  creditScore: "",
  employmentType: "salaried",
  loanAmount: "",
  tenureMonths: "",
};

interface Props {
  onSubmit: (values: LoanFormValues) => void;
  loading: boolean;
}

export default function LoanForm({ onSubmit, loading }: Props) {
  const [values, setValues] = useState<LoanFormValues>(initialValues);

  function update<K extends keyof LoanFormValues>(field: K, value: LoanFormValues[K]) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    onSubmit(values);
  }

  return (
    <form className="loan-form" onSubmit={handleSubmit}>
      <div className="form-section">
        <h2>About you</h2>

        <label>
          Monthly income (₹)
          <input
            type="number"
            min="0"
            required
            value={values.monthlyIncome}
            onChange={(e) => update("monthlyIncome", e.target.value)}
          />
        </label>

        <label>
          Existing EMIs per month (₹)
          <span className="hint">Car loans, personal loans, anything else you're already paying off</span>
          <input
            type="number"
            min="0"
            value={values.existingEmi}
            onChange={(e) => update("existingEmi", e.target.value)}
          />
        </label>

        <label>
          Credit score
          <span className="hint">Between 300 and 900 — check this on CIBIL, Experian, or your bank app</span>
          <input
            type="number"
            min="300"
            max="900"
            required
            value={values.creditScore}
            onChange={(e) => update("creditScore", e.target.value)}
          />
        </label>

        <label>
          Employment type
          <select
            value={values.employmentType}
            onChange={(e) => update("employmentType", e.target.value as LoanFormValues["employmentType"])}
          >
            <option value="salaried">Salaried</option>
            <option value="self_employed">Self-employed</option>
          </select>
        </label>
      </div>

      <div className="form-section">
        <h2>What you want to borrow</h2>

        <label>
          Loan amount (₹)
          <input
            type="number"
            min="1"
            required
            value={values.loanAmount}
            onChange={(e) => update("loanAmount", e.target.value)}
          />
        </label>

        <label>
          Tenure (months)
          <input
            type="number"
            min="1"
            required
            value={values.tenureMonths}
            onChange={(e) => update("tenureMonths", e.target.value)}
          />
        </label>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Checking your eligibility..." : "Check eligibility"}
      </button>
    </form>
  );
}
