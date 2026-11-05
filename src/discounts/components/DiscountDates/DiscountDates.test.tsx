import { type VoucherScheduleDateData } from "@dashboard/discounts/components/VoucherChannelAvailabilityCard/getVoucherSchedulePhase";
import { DiscountErrorCode, type DiscountErrorFragment } from "@dashboard/graphql";
import Wrapper from "@test/wrapper";
import { fireEvent, render, screen } from "@testing-library/react";

import { DiscountDates } from "./DiscountDates";
import { getDefaultEndDateAfterStart } from "./getDefaultEndDateAfterStart";

describe("getDefaultEndDateAfterStart", () => {
  it("returns the calendar day after start", () => {
    // Arrange // Act // Assert
    expect(getDefaultEndDateAfterStart("2026-12-15")).toBe("2026-12-16");
  });

  it("rolls across month boundaries", () => {
    // Arrange // Act // Assert
    expect(getDefaultEndDateAfterStart("2026-01-31")).toBe("2026-02-01");
  });

  it("returns empty string when start date is missing or invalid", () => {
    // Arrange // Act // Assert
    expect(getDefaultEndDateAfterStart("")).toBe("");
    expect(getDefaultEndDateAfterStart("not-a-date")).toBe("");
  });
});

describe("DiscountDates", () => {
  const data: VoucherScheduleDateData = {
    startDate: "2030-12-31",
    startTime: "10:00",
    hasEndDate: true,
    endDate: "2031-01-31",
    endTime: "10:00",
  };
  const incompleteStartDateError: DiscountErrorFragment = {
    __typename: "DiscountError",
    code: DiscountErrorCode.INVALID,
    field: "startDate",
    channels: null,
    message: "Enter a complete date.",
    voucherCodes: null,
  };

  it("shows a partly entered start date under the date input only", () => {
    // Arrange & Act
    render(
      <DiscountDates
        data={{ ...data, startDate: "" }}
        disabled={false}
        errors={[incompleteStartDateError]}
        incompleteFields={["startDate"]}
        onIncompleteFieldsChange={jest.fn()}
        onChange={jest.fn()}
        unwrapped
      />,
      { wrapper: Wrapper },
    );

    // Assert
    expect(screen.getAllByText("Enter a complete date.")).toHaveLength(1);
  });

  it("reports a partly filled input when it loses focus", () => {
    // Arrange
    const onIncompleteFieldsChange = jest.fn();

    render(
      <DiscountDates
        data={data}
        disabled={false}
        errors={[]}
        incompleteFields={[]}
        onIncompleteFieldsChange={onIncompleteFieldsChange}
        onChange={jest.fn()}
        unwrapped
      />,
      { wrapper: Wrapper },
    );

    const endDateInput = screen.getByTestId("end-date-input");

    // jsdom has no partial date entry, so report it the way a browser does.
    Object.defineProperty(endDateInput, "validity", { value: { badInput: true } });

    // Act
    fireEvent.blur(endDateInput);

    // Assert
    expect(onIncompleteFieldsChange).toHaveBeenCalledWith(["endDate"]);
  });

  it("forgets partly filled end fields when the end date is turned off", () => {
    // Arrange
    const onIncompleteFieldsChange = jest.fn();

    render(
      <DiscountDates
        data={data}
        disabled={false}
        errors={[]}
        incompleteFields={["startTime", "endTime"]}
        onIncompleteFieldsChange={onIncompleteFieldsChange}
        onChange={jest.fn()}
        unwrapped
      />,
      { wrapper: Wrapper },
    );

    // Act
    fireEvent.click(screen.getByTestId("has-end-date"));

    // Assert
    expect(onIncompleteFieldsChange).toHaveBeenCalledWith(["startTime"]);
  });
});
