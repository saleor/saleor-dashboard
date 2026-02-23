import {
  criticalProblemFixture,
  dismissedProblemFixture,
  newerWarningProblemFixture,
  warningProblemFixture,
  webhookErrorFixture,
} from "@dashboard/extensions/fixtures";
import { AppTypeEnum } from "@dashboard/graphql";

import { getActionLink, sortProblems } from "./ProblemsList";

describe("AppProblems / ProblemsList / sortProblems", () => {
  it("places dismissed problems after non-dismissed", () => {
    // Arrange
    const problems = [dismissedProblemFixture, warningProblemFixture, criticalProblemFixture];

    // Act
    const sorted = sortProblems(problems);

    // Assert
    const dismissedIndex = sorted.findIndex(p => p === dismissedProblemFixture);
    const activeIndices = sorted
      .map((p, i) => (p !== dismissedProblemFixture ? i : -1))
      .filter(i => i >= 0);

    expect(activeIndices.every(i => i < dismissedIndex)).toBe(true);
  });

  it("places critical problems before non-critical among active problems", () => {
    // Arrange
    const problems = [warningProblemFixture, criticalProblemFixture];

    // Act
    const sorted = sortProblems(problems);

    // Assert
    expect(sorted[0]).toBe(criticalProblemFixture);
    expect(sorted[1]).toBe(warningProblemFixture);
  });

  it("sorts by date (newest first) within same severity", () => {
    // Arrange
    const problems = [warningProblemFixture, newerWarningProblemFixture];

    // Act
    const sorted = sortProblems(problems);

    // Assert
    expect(sorted[0]).toBe(newerWarningProblemFixture);
    expect(sorted[1]).toBe(warningProblemFixture);
  });

  it("applies full sort order: critical → non-critical → dismissed, newest first within group", () => {
    // Arrange
    const problems = [
      dismissedProblemFixture,
      warningProblemFixture,
      webhookErrorFixture,
      criticalProblemFixture,
      newerWarningProblemFixture,
    ];

    // Act
    const sorted = sortProblems(problems);

    // Assert — critical first, then warnings newest-first, then dismissed
    expect(sorted[0]).toBe(criticalProblemFixture);
    expect(sorted[1]).toBe(newerWarningProblemFixture);
    expect(sorted[2]).toBe(webhookErrorFixture);
    expect(sorted[3]).toBe(warningProblemFixture);
    expect(sorted[4]).toBe(dismissedProblemFixture);
  });

  it("returns empty array for empty input", () => {
    expect(sortProblems([])).toEqual([]);
  });

  it("does not mutate the original array", () => {
    // Arrange
    const problems = [warningProblemFixture, criticalProblemFixture];
    const originalOrder = [...problems];

    // Act
    sortProblems(problems);

    // Assert
    expect(problems).toEqual(originalOrder);
  });
});

describe("AppProblems / ProblemsList / getActionLink", () => {
  it("returns 'checkWebhooks' link for WebhookDeliveryError", () => {
    // Act
    const result = getActionLink(webhookErrorFixture, "app-123");

    // Assert
    expect(result).toEqual({
      href: expect.stringContaining("app-123"),
      label: "checkWebhooks",
    });
  });

  it("returns 'openTheApp' link for THIRDPARTY AppProblem", () => {
    // Act
    const result = getActionLink(criticalProblemFixture, "app-456", AppTypeEnum.THIRDPARTY);

    // Assert
    expect(result).toEqual({
      href: expect.stringContaining("app-456"),
      label: "openTheApp",
    });
  });

  it("returns null for AppProblem with non-THIRDPARTY type", () => {
    // Act
    const result = getActionLink(criticalProblemFixture, "app-789", AppTypeEnum.LOCAL);

    // Assert
    expect(result).toBeNull();
  });

  it("returns null for AppProblem with no app type", () => {
    // Act
    const result = getActionLink(criticalProblemFixture, "app-789");

    // Assert
    expect(result).toBeNull();
  });
});
