import { type PromotionFragment, PromotionTypeEnum } from "@dashboard/graphql";
import { createIntl } from "react-intl";

import { getPromotionListStatusLabel } from "./datagrid";

const intl = createIntl({ locale: "en" });

const createPromotion = (overrides: Partial<PromotionFragment> = {}): PromotionFragment =>
  ({
    __typename: "Promotion" as const,
    id: "promo-1",
    name: "Summer catalog",
    startDate: "2024-01-01T00:00:00.000Z",
    endDate: "2024-12-31T23:59:59.000Z",
    type: PromotionTypeEnum.CATALOGUE,
    metadata: [],
    privateMetadata: [],
    ...overrides,
  }) as PromotionFragment;

describe("getPromotionListStatusLabel", () => {
  it("returns Active without relative hint while live", () => {
    // Arrange
    const promotion = createPromotion({
      startDate: "2024-01-01T00:00:00.000Z",
      endDate: "2024-12-31T23:59:59.000Z",
    });

    // Act
    const result = getPromotionListStatusLabel({
      promotion,
      intl,
      now: new Date("2024-06-15T12:00:00.000Z"),
    });

    // Assert
    expect(result.status).toBe("success");
    expect(result.label).toBe("Active");
  });

  it("returns Scheduled with relative time before start", () => {
    // Arrange
    const promotion = createPromotion({
      startDate: "2024-06-20T00:00:00.000Z",
      endDate: "2024-12-31T23:59:59.000Z",
    });

    // Act
    const result = getPromotionListStatusLabel({
      promotion,
      intl,
      now: new Date("2024-06-15T12:00:00.000Z"),
    });

    // Assert
    expect(result.status).toBe("scheduled");
    expect(result.label).toMatch(/^Scheduled · /);
  });

  it("returns Ended with relative time after end", () => {
    // Arrange
    const promotion = createPromotion({
      startDate: "2024-01-01T00:00:00.000Z",
      endDate: "2024-06-01T00:00:00.000Z",
    });

    // Act
    const result = getPromotionListStatusLabel({
      promotion,
      intl,
      now: new Date("2024-06-15T12:00:00.000Z"),
    });

    // Assert
    expect(result.status).toBe("neutral");
    expect(result.label).toMatch(/^Ended · /);
  });
});
