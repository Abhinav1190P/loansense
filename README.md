# LoanSense

A loan eligibility planner: enter a financial profile and a loan request, get a decision from a rule-based backend engine plus a plain-English explanation with specific tips.

## Stack

- Backend: Node/Express/TypeScript, with the eligibility logic in its own module (`backend/src/lib`), separate from the route handler.
- Frontend: React/TypeScript (Vite).
- LLM: called through the OpenAI SDK pointed at Groq's OpenAI-compatible endpoint (`llama-3.3-70b-versatile`). Groq isn't one of the three providers the brief names (OpenAI, Anthropic, Gemini) — I used it for speed and cost while building, but the client is just an env-configured `baseURL`/`apiKey`/`model`, so pointing it at OpenAI or Anthropic instead is a one-line change in `.env`, not a code change.
- No database — stateless by design, per the brief.

## Running it

Backend:

```bash
cd backend
npm install
cp .env.example .env   # add your LLM_API_KEY, or leave blank to get a plain-text fallback explanation
npm run dev
```

Frontend:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:5173`. The backend runs on port 4000.

Tests:

```bash
cd backend
npm test
```

## How the rule engine works

`backend/src/lib/creditPolicy.ts` maps credit score to a tier (approved / conditionally approved / under review / declined) and an interest rate. `backend/src/lib/loanMath.ts` has the EMI formula, FOIR calculation, and the repayment schedule builder — all pure functions, no framework code in them. `ruleEngine.ts` combines the two: a good credit tier can still get declined if the resulting EMI pushes FOIR past 50%, since that's a hard cap in the brief, not just one factor among others.

## AI tool used

Built with Claude (Anthropic), using to generate initial boiler template and designing page.

## What I decided

- FOIR is a hard cap: even a 800 credit score gets declined if the requested loan's EMI would break the 50% limit, rather than just lowering the approval tier.
- The 650–699 "under review" tier still gets a provisional rate (14%) and full numbers shown, so the applicant has something concrete while waiting on manual review, rather than a blank result.
- If no LLM key is configured, the app falls back to the rule engine's own plain-English reason rather than failing — the core flow stays demoable without a key.

## What I'd do next

- Let the AI explanation suggest a reduced loan amount that would fit within FOIR, not just qualitative tips.
- Cache/log LLM calls for cost control and to catch regressions in explanation quality.
- Add the bonus features — saved loan history (needs auth), a side-by-side scenario comparison, and a credit-score "what if" slider.
