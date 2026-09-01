export function calculateEmi(principal: number, annualRatePercent: number, tenureMonths: number): number {
  if (tenureMonths <= 0) return 0;
  if (annualRatePercent === 0) return principal / tenureMonths;

  const monthlyRate = annualRatePercent / 12 / 100;
  const growth = Math.pow(1 + monthlyRate, tenureMonths);
  const emi = (principal * monthlyRate * growth) / (growth - 1);
  return Math.round(emi * 100) / 100;
}

export function calculateFoir(existingEmi: number, newEmi: number, monthlyIncome: number): number {
  if (monthlyIncome <= 0) return Infinity;
  return (existingEmi + newEmi) / monthlyIncome;
}

export function buildRepaymentSchedule(principal: number, annualRatePercent: number, tenureMonths: number, monthsToShow: number) {
  const emi = calculateEmi(principal, annualRatePercent, tenureMonths);
  const monthlyRate = annualRatePercent / 12 / 100;

  const rows = [];
  let balance = principal;

  for (let month = 1; month <= Math.min(monthsToShow, tenureMonths); month++) {
    const interestPaid = Math.round(balance * monthlyRate * 100) / 100;
    let principalPaid = Math.round((emi - interestPaid) * 100) / 100;
    if (month === tenureMonths) principalPaid = balance;

    const openingBalance = balance;
    balance = Math.round((balance - principalPaid) * 100) / 100;

    rows.push({
      month,
      openingBalance,
      emi,
      principalPaid,
      interestPaid,
      closingBalance: Math.max(balance, 0),
    });
  }

  return rows;
}

export function totalInterestAndRepayment(principal: number, annualRatePercent: number, tenureMonths: number) {
  const emi = calculateEmi(principal, annualRatePercent, tenureMonths);
  const totalRepayment = Math.round(emi * tenureMonths * 100) / 100;
  const totalInterest = Math.round((totalRepayment - principal) * 100) / 100;
  return { emi, totalRepayment, totalInterest };
}
