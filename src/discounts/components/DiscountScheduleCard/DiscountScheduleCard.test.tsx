import { type ScheduleDateField } from "@dashboard/discounts/components/DiscountDates/incompleteScheduleFields";
import { type VoucherScheduleDateData } from "@dashboard/discounts/components/VoucherChannelAvailabilityCard/getVoucherSchedulePhase";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";

import { DiscountScheduleCard } from "./DiscountScheduleCard";

// Jest runs in UTC, so 23:30 today is later than now and midnight today is earlier.
const NOW = new Date("2026-11-06T12:00:00Z");

const tonight: VoucherScheduleDateData = {
  startDate: "2026-11-06",
  startTime: "23:30",
  hasEndDate: true,
  endDate: "2026-11-06",
  endTime: "23:45",
};

const renderCard = (
  data: VoucherScheduleDateData,
  incompleteFields: ScheduleDateField[] = [],
): ReturnType<typeof render> =>
  render(
    <DiscountScheduleCard
      data={data}
      errors={[]}
      intro="Intro"
      incompleteFields={incompleteFields}
      onChange={jest.fn()}
    />,
    { wrapper: Wrapper },
  );

const getStatus = (): string =>
  screen.getByTestId("discount-schedule-card-status").textContent ?? "";

describe("DiscountScheduleCard status", () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(NOW);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("keeps the last status while the start hour is partly typed", () => {
    // Arrange
    const { rerender } = renderCard(tonight);
    const loadedStatus = getStatus();

    // Act
    rerender(
      <DiscountScheduleCard
        data={{ ...tonight, startTime: "" }}
        errors={[]}
        intro="Intro"
        incompleteFields={["startTime"]}
        onChange={jest.fn()}
      />,
    );

    // Assert
    expect(loadedStatus).toBe("Scheduled");
    expect(getStatus()).toBe("Scheduled");
  });

  it("reads a fully cleared start hour as midnight", () => {
    // Arrange
    const { rerender } = renderCard(tonight);

    // Act
    rerender(
      <DiscountScheduleCard
        data={{ ...tonight, startTime: "" }}
        errors={[]}
        intro="Intro"
        incompleteFields={[]}
        onChange={jest.fn()}
      />,
    );

    // Assert
    expect(getStatus()).toBe("Active");
  });

  it("keeps the last status while both hours are partly typed", () => {
    // Arrange
    const { rerender } = renderCard(tonight);

    // Act
    rerender(
      <DiscountScheduleCard
        data={{ ...tonight, startTime: "", endTime: "" }}
        errors={[]}
        intro="Intro"
        incompleteFields={["startTime", "endTime"]}
        onChange={jest.fn()}
      />,
    );

    // Assert
    expect(getStatus()).toBe("Scheduled");
  });

  it("updates the status once the partly typed hour is complete again", () => {
    // Arrange
    const { rerender } = renderCard(tonight);

    rerender(
      <DiscountScheduleCard
        data={{ ...tonight, startTime: "" }}
        errors={[]}
        intro="Intro"
        incompleteFields={["startTime"]}
        onChange={jest.fn()}
      />,
    );

    // Act
    rerender(
      <DiscountScheduleCard
        data={{ ...tonight, startTime: "08:00" }}
        errors={[]}
        intro="Intro"
        incompleteFields={[]}
        onChange={jest.fn()}
      />,
    );

    // Assert
    expect(getStatus()).toBe("Active");
  });
});
