import { describe, it, expect } from "vitest";
import { getCreditTier } from "../lib/creditPolicy";

describe("getCreditTier boundaries", () => {
  it("750 is approved", () => {
    expect(getCreditTier(750).status).toBe("approved");
  });

  it("749 is conditionally approved, not approved", () => {
    expect(getCreditTier(749).status).toBe("conditionally_approved");
  });

  it("700 is conditionally approved", () => {
    expect(getCreditTier(700).status).toBe("conditionally_approved");
  });

  it("699 is under review, not conditionally approved", () => {
    expect(getCreditTier(699).status).toBe("under_review");
  });

  it("650 is under review", () => {
    expect(getCreditTier(650).status).toBe("under_review");
  });

  it("649 is declined", () => {
    expect(getCreditTier(649).status).toBe("declined");
    expect(getCreditTier(649).interestRate).toBeNull();
  });

  it("300 (worst possible score) is declined", () => {
    expect(getCreditTier(300).status).toBe("declined");
  });
});
