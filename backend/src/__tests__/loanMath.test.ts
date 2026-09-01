import { describe, it, expect } from "vitest";
import { calculateEmi, calculateFoir, totalInterestAndRepayment } from "../lib/loanMath";

describe("calculateEmi", () => {
  it("matches the standard amortisation formula for a typical loan", () => {
    const emi = calculateEmi(500000, 10.5, 60);
    expect(emi).toBeCloseTo(10746.95, 1);
  });

  it("falls back to a flat split when the rate is zero", () => {
    expect(calculateEmi(120000, 0, 12)).toBe(10000);
  });

  it("returns 0 for a non-positive tenure", () => {
    expect(calculateEmi(100000, 10, 0)).toBe(0);
  });
});

describe("calculateFoir", () => {
  it("adds the new EMI to existing obligations before dividing by income", () => {
    const foir = calculateFoir(6000, 12000, 60000);
    expect(foir).toBeCloseTo(0.3, 5);
  });

  it("handles zero existing obligations", () => {
    const foir = calculateFoir(0, 15000, 50000);
    expect(foir).toBeCloseTo(0.3, 5);
  });

  it("sits exactly on the 50% boundary when the numbers land there", () => {
    const foir = calculateFoir(10000, 15000, 50000);
    expect(foir).toBe(0.5);
  });
});

describe("totalInterestAndRepayment", () => {
  it("total repayment equals EMI times tenure", () => {
    const { emi, totalRepayment } = totalInterestAndRepayment(300000, 12, 36);
    expect(totalRepayment).toBeCloseTo(emi * 36, 1);
  });
});
