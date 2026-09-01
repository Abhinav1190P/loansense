import OpenAI from "openai";
import { LoanApplication, LoanDecision } from "../types";

const client = new OpenAI({
  apiKey: process.env.LLM_API_KEY,
  baseURL: process.env.LLM_BASE_URL || "https://api.groq.com/openai/v1",
});

const MODEL = process.env.LLM_MODEL || "openai/gpt-oss-20b";

function buildPrompt(application: LoanApplication, decision: LoanDecision): string {
  const lines = [
    `Monthly income: ₹${application.monthlyIncome}`,
    `Existing EMI obligations: ₹${application.existingEmi}`,
    `Credit score: ${application.creditScore}`,
    `Employment type: ${application.employmentType}`,
    `Requested loan: ₹${application.loanAmount} over ${application.tenureMonths} months`,
    `FOIR: ${(decision.foir * 100).toFixed(1)}%`,
    `Decision: ${decision.status}`,
    `Interest rate: ${decision.interestRate ?? "n/a"}`,
    `EMI: ${decision.emi ?? "n/a"}`,
  ];

  return [
    "You are explaining a loan eligibility decision to a non-technical applicant in India.",
    "Use their real numbers below, in plain English, with no unexplained jargon like FOIR or amortisation.",
    "If the decision is not a clean approval, give 2 to 3 specific, quantified tips using their actual figures",
    "(for example, naming a real rupee amount that would change their outcome).",
    "Keep it to a short paragraph plus a short tips list. Do not repeat these instructions back.",
    "",
    ...lines,
  ].join("\n");
}

export async function explainDecision(application: LoanApplication, decision: LoanDecision): Promise<string> {
  if (!process.env.LLM_API_KEY) {
    console.log("[explain] no LLM_API_KEY set, using fallback copy");
    return fallbackExplanation(decision);
  }

  try {
    const response = await client.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: buildPrompt(application, decision) }],
      temperature: 0.4,
      max_tokens: 400,
    });

    console.log(`[explain] got a response from ${MODEL}`);
    return response.choices[0]?.message?.content?.trim() || fallbackExplanation(decision);
  } catch (err) {
    console.error("[explain] call failed, falling back to canned copy:", err);
    return fallbackExplanation(decision);
  }
}

function fallbackExplanation(decision: LoanDecision): string {
  return decision.reason;
}