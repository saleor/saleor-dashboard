import { type DiscoutFormData } from "@dashboard/discounts/types";
import { PromotionTypeEnum } from "@dashboard/graphql";
import { createIntl } from "react-intl";

import { getValidationSchema } from "./validationSchema";

const intl = createIntl({ locale: "en", messages: {} });

const scheduledDates: DiscoutFormData["dates"] = {
  startDate: "2026-12-20",
  startTime: "13:45",
  hasEndDate: true,
  endDate: "2026-12-21",
  endTime: "13:45",
};

const getDateErrors = (
  dates: DiscoutFormData["dates"],
  savedDates?: DiscoutFormData["dates"],
): Record<string, string> => {
  const form: DiscoutFormData = {
    type: PromotionTypeEnum.CATALOGUE,
    name: "Winter sale",
    description: "",
    dates,
    rules: [],
  };
  const result = getValidationSchema(intl, { savedDates }).safeParse(form);

  if (result.success) {
    return {};
  }

  return Object.fromEntries(
    result.error.issues
      .filter(issue => issue.path[0] === "dates")
      .map(issue => [issue.path.slice(1).join("."), issue.message]),
  );
};

describe("promotion schedule validation", () => {
  it("accepts a complete schedule", () => {
    // Arrange
    const dates = scheduledDates;

    // Act
    const errors = getDateErrors(dates);

    // Assert
    expect(errors).toEqual({});
  });

  it("blocks a partly typed start hour instead of saving midnight", () => {
    // Arrange
    const partlyTyped: DiscoutFormData["dates"] = {
      ...scheduledDates,
      startTime: "",
      incompleteFields: ["startTime"],
    };
    const cleared: DiscoutFormData["dates"] = { ...scheduledDates, startTime: "" };

    // Act
    const partlyTypedErrors = getDateErrors(partlyTyped);
    const clearedErrors = getDateErrors(cleared);

    // Assert
    expect(partlyTypedErrors).toEqual({ startTime: "Enter a complete time." });
    expect(clearedErrors).toEqual({});
  });

  it("blocks a partly typed end date only while the end date is on", () => {
    // Arrange
    const endOn: DiscoutFormData["dates"] = {
      ...scheduledDates,
      endDate: "",
      incompleteFields: ["endDate"],
    };
    const endOff: DiscoutFormData["dates"] = { ...endOn, hasEndDate: false };

    // Act
    const endOnErrors = getDateErrors(endOn);
    const endOffErrors = getDateErrors(endOff);

    // Assert
    expect(endOnErrors).toEqual({ endDate: "Enter a complete date." });
    expect(endOffErrors).toEqual({});
  });

  it("requires an end date while Set end date is on", () => {
    // Arrange
    const endOn: DiscoutFormData["dates"] = { ...scheduledDates, endDate: "", endTime: "" };
    const endOff: DiscoutFormData["dates"] = { ...endOn, hasEndDate: false };

    // Act
    const endOnErrors = getDateErrors(endOn);
    const endOffErrors = getDateErrors(endOff);

    // Assert
    expect(endOnErrors).toEqual({ endDate: "This field is required" });
    expect(endOffErrors).toEqual({});
  });

  it("blocks an end at or before the start", () => {
    // Arrange
    const sameInstant: DiscoutFormData["dates"] = {
      ...scheduledDates,
      endDate: scheduledDates.startDate,
      endTime: scheduledDates.startTime,
    };
    const endBeforeStart: DiscoutFormData["dates"] = { ...scheduledDates, endDate: "2026-12-19" };
    const oneMinuteLater: DiscoutFormData["dates"] = { ...sameInstant, endTime: "13:46" };

    // Act
    const sameInstantErrors = getDateErrors(sameInstant);
    const endBeforeStartErrors = getDateErrors(endBeforeStart);
    const oneMinuteLaterErrors = getDateErrors(oneMinuteLater);

    // Assert
    expect(sameInstantErrors).toEqual({ endDate: "End date must be after the start date." });
    expect(endBeforeStartErrors).toEqual({ endDate: "End date must be after the start date." });
    expect(oneMinuteLaterErrors).toEqual({});
  });

  it("blocks a start or end date whose year is still being typed", () => {
    // Arrange
    const shortStartYear: DiscoutFormData["dates"] = { ...scheduledDates, startDate: "0202-12-20" };
    const shortEndYear: DiscoutFormData["dates"] = { ...scheduledDates, endDate: "0111-12-21" };

    // Act
    const shortStartYearErrors = getDateErrors(shortStartYear);
    const shortEndYearErrors = getDateErrors(shortEndYear);

    // Assert
    expect(shortStartYearErrors).toEqual({ startDate: "Enter a complete date." });
    expect(shortEndYearErrors).toEqual({ endDate: "Enter a complete date." });
  });

  it("does not compare a saved start and end the merchant left alone", () => {
    // Arrange
    const savedSameInstant: DiscoutFormData["dates"] = {
      ...scheduledDates,
      endDate: scheduledDates.startDate,
      endTime: scheduledDates.startTime,
    };
    const movedStart: DiscoutFormData["dates"] = { ...savedSameInstant, startTime: "13:50" };

    // Act
    const untouchedErrors = getDateErrors(savedSameInstant, savedSameInstant);
    const movedStartErrors = getDateErrors(movedStart, savedSameInstant);

    // Assert
    expect(untouchedErrors).toEqual({});
    expect(movedStartErrors).toEqual({ endDate: "End date must be after the start date." });
  });

  it("does not compare start and end while a field is partly typed", () => {
    // Arrange
    const dates: DiscoutFormData["dates"] = {
      ...scheduledDates,
      endDate: scheduledDates.startDate,
      endTime: "",
      incompleteFields: ["endTime"],
    };

    // Act
    const errors = getDateErrors(dates);

    // Assert
    expect(errors).toEqual({ endTime: "Enter a complete time." });
  });
});
