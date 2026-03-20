import {
  criticalProblemFixture,
  dismissedProblemFixture,
  warningProblemFixture,
  webhookErrorFixture,
} from "./fixtures";
import { getProblemSortDate, isProblemCritical, isProblemDismissed } from "./types";

describe("extensions / types / isProblemCritical", () => {
  it("returns true for critical AppProblem", () => {
    expect(isProblemCritical(criticalProblemFixture)).toBe(true);
  });

  it("returns false for non-critical AppProblem", () => {
    expect(isProblemCritical(warningProblemFixture)).toBe(false);
  });

  it("returns false for WebhookDeliveryError (always a warning)", () => {
    expect(isProblemCritical(webhookErrorFixture)).toBe(false);
  });
});

describe("extensions / types / isProblemDismissed", () => {
  it("returns false for non-dismissed AppProblem", () => {
    expect(isProblemDismissed(criticalProblemFixture)).toBe(false);
  });

  it("returns true for dismissed AppProblem", () => {
    expect(isProblemDismissed(dismissedProblemFixture)).toBe(true);
  });

  it("returns false for WebhookDeliveryError (never dismissed)", () => {
    expect(isProblemDismissed(webhookErrorFixture)).toBe(false);
  });
});

describe("extensions / types / getProblemSortDate", () => {
  it("returns updatedAt for AppProblem", () => {
    expect(getProblemSortDate(criticalProblemFixture)).toBe(criticalProblemFixture.updatedAt);
  });

  it("returns createdAt for WebhookDeliveryError", () => {
    expect(getProblemSortDate(webhookErrorFixture)).toBe(webhookErrorFixture.createdAt);
  });
});
