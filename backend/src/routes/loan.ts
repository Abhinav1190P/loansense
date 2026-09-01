import { Router } from "express";
import { evaluateLoan } from "../lib/ruleEngine";
import { explainDecision } from "../lib/explain";
import { LoanApplication } from "../types";

const router = Router();

router.post("/evaluate", async (req, res) => {
  const body = req.body as Partial<LoanApplication>;

  const missing = ["monthlyIncome", "existingEmi", "creditScore", "employmentType", "loanAmount", "tenureMonths"]
    .filter((field) => body[field as keyof LoanApplication] === undefined);

  if (missing.length > 0) {
    return res.status(400).json({ error: `Missing fields: ${missing.join(", ")}` });
  }

  const application: LoanApplication = {
    monthlyIncome: Number(body.monthlyIncome),
    existingEmi: Number(body.existingEmi),
    creditScore: Number(body.creditScore),
    employmentType: body.employmentType === "self_employed" ? "self_employed" : "salaried",
    loanAmount: Number(body.loanAmount),
    tenureMonths: Number(body.tenureMonths),
  };

  if (application.creditScore < 300 || application.creditScore > 900) {
    return res.status(400).json({ error: "Credit score must be between 300 and 900." });
  }

  const decision = evaluateLoan(application);
  const explanation = await explainDecision(application, decision);

  res.json({ decision, explanation });
});

export default router;
