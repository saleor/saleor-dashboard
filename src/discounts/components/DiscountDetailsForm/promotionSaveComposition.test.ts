import { type DiscoutFormData } from "@dashboard/discounts/types";
import { PromotionTypeEnum } from "@dashboard/graphql";

import {
  buildPromotionSaveComposition,
  EMPTY_PROMOTION_SAVE_COMPOSITION,
  hasPromotionSaveComposition,
  schedulesEqual,
} from "./promotionSaveComposition";

const baseline: DiscoutFormData = {
  type: PromotionTypeEnum.CATALOGUE,
  name: "Summer",
  description: "",
  dates: {
    startDate: "2026-06-01",
    startTime: "10:00",
    hasEndDate: false,
    endDate: "",
    endTime: "",
  },
  rules: [],
};

describe("promotionSaveComposition", () => {
  it("is pristine when current matches baseline", () => {
    // Arrange
    const current: DiscoutFormData = { ...baseline, dates: { ...baseline.dates } };

    // Act
    const composition = buildPromotionSaveComposition(current, baseline);

    // Assert
    expect(composition).toEqual(EMPTY_PROMOTION_SAVE_COMPOSITION);
    expect(hasPromotionSaveComposition(composition)).toBe(false);
  });

  it("marks general dirty when name changes", () => {
    // Arrange // Act
    const composition = buildPromotionSaveComposition({ ...baseline, name: "Winter" }, baseline);

    // Assert
    expect(composition.hasGeneral).toBe(true);
    expect(composition.hasSchedule).toBe(false);
  });

  it("treats empty editor JSON as equal to empty description", () => {
    // Arrange // Act
    const composition = buildPromotionSaveComposition(
      { ...baseline, description: JSON.stringify({ blocks: [] }) },
      baseline,
    );

    // Assert
    expect(composition.hasGeneral).toBe(false);
  });

  it("marks schedule dirty when start date changes", () => {
    // Arrange // Act
    const composition = buildPromotionSaveComposition(
      {
        ...baseline,
        dates: { ...baseline.dates, startDate: "2026-07-01" },
      },
      baseline,
    );

    // Assert
    expect(composition.hasSchedule).toBe(true);
    expect(composition.hasGeneral).toBe(false);
  });

  it("ignores end date leftovers when hasEndDate is false", () => {
    // Arrange // Act // Assert
    expect(
      schedulesEqual(
        {
          ...baseline.dates,
          endDate: "2026-12-31",
          endTime: "23:59",
        },
        baseline.dates,
      ),
    ).toBe(true);
  });

  it("compares end date when hasEndDate is true", () => {
    // Arrange
    const withEnd: DiscoutFormData = {
      ...baseline,
      dates: {
        ...baseline.dates,
        hasEndDate: true,
        endDate: "2026-08-01",
        endTime: "18:00",
      },
    };

    // Act
    const composition = buildPromotionSaveComposition(
      {
        ...withEnd,
        dates: { ...withEnd.dates, endDate: "2026-08-02" },
      },
      withEnd,
    );

    // Assert
    expect(composition.hasSchedule).toBe(true);
  });
});
