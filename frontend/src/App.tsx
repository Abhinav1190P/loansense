import { useState } from "react";
import LoanForm from "./components/LoanForm";
import ResultCard from "./components/ResultCard";
import RepaymentTable from "./components/RepaymentTable";
import { evaluateLoan } from "./api";
import type { EvaluateResponse, LoanFormValues } from "./types";
import "./index.css";

export default function App() {
  const [result, setResult] = useState<EvaluateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(values: LoanFormValues) {
    setLoading(true);
    setError(null);
    try {
      const response = await evaluateLoan(values);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header>
        <h1>LoanSense</h1>
        <p>See where you stand before you apply, in plain English.</p>
      </header>

      <main>
        <LoanForm onSubmit={handleSubmit} loading={loading} />

        {error && <div className="error-banner">{error}</div>}

        {result && (
          <div className="results">
            <ResultCard decision={result.decision} explanation={result.explanation} />
            <RepaymentTable schedule={result.decision.schedule} />
          </div>
        )}
      </main>
    </div>
  );
}
