import { PromotionTypeEnum } from "@dashboard/graphql";

import { type DiscoutFormData } from "../../types";
import { createUpdateHandler, shouldClearPromotionEndDateFirst } from "./handlers";

describe("shouldClearPromotionEndDateFirst", () => {
  it("returns true when clearing end and moving start past the previous end", () => {
    // Arrange // Act // Assert
    expect(
      shouldClearPromotionEndDateFirst({
        hasEndDate: false,
        nextStartDate: "2026-08-28T14:40:00.000Z",
        currentEndDate: "2026-08-01T00:00:00.000Z",
      }),
    ).toBe(true);
  });

  it("returns false when end date remains enabled", () => {
    // Arrange // Act // Assert
    expect(
      shouldClearPromotionEndDateFirst({
        hasEndDate: true,
        nextStartDate: "2026-08-28T14:40:00.000Z",
        currentEndDate: "2026-08-01T00:00:00.000Z",
      }),
    ).toBe(false);
  });

  it("returns false when there is no current end date to clear", () => {
    // Arrange // Act // Assert
    expect(
      shouldClearPromotionEndDateFirst({
        hasEndDate: false,
        nextStartDate: "2026-08-28T14:40:00.000Z",
        currentEndDate: null,
      }),
    ).toBe(false);
  });

  it("returns false when the new start is still before the previous end", () => {
    // Arrange // Act // Assert
    expect(
      shouldClearPromotionEndDateFirst({
        hasEndDate: false,
        nextStartDate: "2026-07-15T14:40:00.000Z",
        currentEndDate: "2026-08-01T00:00:00.000Z",
      }),
    ).toBe(false);
  });
});

describe("createUpdateHandler", () => {
  const promotion = {
    __typename: "Promotion" as const,
    id: "promo-1",
    name: "Summer",
    type: null,
    description: null,
    startDate: "2026-07-01T00:00:00.000Z",
    endDate: "2026-08-01T00:00:00.000Z",
    rules: [],
  };

  const formData: DiscoutFormData = {
    name: "Summer",
    type: PromotionTypeEnum.CATALOGUE,
    description: "",
    rules: [],
    dates: {
      startDate: "2026-08-28",
      startTime: "14:40",
      endDate: "2026-08-01",
      endTime: "00:00",
      hasEndDate: false,
    },
  };

  it("clears end date before updating start when they would conflict", async () => {
    // Arrange
    const update = jest.fn().mockResolvedValue({ data: { promotionUpdate: { errors: [] } } });
    const handler = createUpdateHandler(promotion, update);

    // Act
    await handler(formData);

    // Assert
    expect(update).toHaveBeenCalledTimes(2);
    expect(update).toHaveBeenNthCalledWith(
      1,
      {
        id: "promo-1",
        input: { endDate: null },
      },
      { silent: true },
    );
    expect(update.mock.calls[1][0].input.endDate).toBeNull();
    expect(update.mock.calls[1][0].input.startDate).toBeTruthy();
    expect(update.mock.calls[1][1]).toBeUndefined();
  });

  it("skips the clear step when end date stays enabled", async () => {
    // Arrange
    const update = jest.fn().mockResolvedValue({ data: { promotionUpdate: { errors: [] } } });
    const handler = createUpdateHandler(promotion, update);

    // Act
    await handler({
      ...formData,
      dates: {
        ...formData.dates,
        hasEndDate: true,
        endDate: "2026-09-01",
        endTime: "23:59",
      },
    });

    // Assert
    expect(update).toHaveBeenCalledTimes(1);
    expect(update.mock.calls[0][0].input.endDate).toBeTruthy();
  });
});
