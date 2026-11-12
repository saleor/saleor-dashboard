import { type VoucherScheduleDateData } from "@dashboard/discounts/components/VoucherChannelAvailabilityCard/getVoucherSchedulePhase";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";

import { VoucherScheduleCard } from "./VoucherScheduleCard";

const running: VoucherScheduleDateData = {
  startDate: "2020-01-01",
  startTime: "00:00",
  hasEndDate: false,
  endDate: "",
  endTime: "",
};

const renderCard = (data: VoucherScheduleDateData, usageLimitReached: boolean): void => {
  render(
    <VoucherScheduleCard
      data={data}
      errors={[]}
      usageLimitReached={usageLimitReached}
      onChange={jest.fn()}
    />,
    { wrapper: Wrapper },
  );
};

describe("VoucherScheduleCard", () => {
  it("shows a running voucher with its usage limit reached as used up", () => {
    // Arrange & Act
    renderCard(running, true);

    // Assert
    expect(screen.getByTestId("voucher-schedule-status")).toHaveTextContent("Used up");
  });

  it("shows a running voucher with uses left as active", () => {
    // Arrange & Act
    renderCard(running, false);

    // Assert
    expect(screen.getByTestId("voucher-schedule-status")).toHaveTextContent("Active");
  });

  it("shows a voucher that hasn't started as scheduled, even with its limit reached", () => {
    // Arrange & Act
    renderCard({ ...running, startDate: "2099-01-01" }, true);

    // Assert
    expect(screen.getByTestId("voucher-schedule-status")).toHaveTextContent("Scheduled");
  });
});
