import { type VoucherScheduleDateData } from "@dashboard/discounts/components/VoucherChannelAvailabilityCard/getVoucherSchedulePhase";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";

import { VoucherRedemptionsCard } from "./VoucherRedemptionsCard";

const running: VoucherScheduleDateData = {
  startDate: "2020-01-01",
  startTime: "00:00",
  hasEndDate: false,
  endDate: "",
  endTime: "",
};

const renderCard = ({
  used,
  usageLimit,
  scheduleData = running,
}: {
  used: number;
  usageLimit: number;
  scheduleData?: VoucherScheduleDateData;
}): void => {
  render(
    <VoucherRedemptionsCard
      used={used}
      hasUsageLimit
      usageLimit={usageLimit}
      codesCount={1}
      channelsCount={1}
      scheduleData={scheduleData}
    />,
    { wrapper: Wrapper },
  );
};

describe("VoucherRedemptionsCard", () => {
  it("says a running voucher can't be redeemed once every use is taken", () => {
    // Arrange & Act
    renderCard({ used: 3, usageLimit: 3 });

    // Assert
    expect(screen.getByTestId("voucher-redemptions-schedule")).toHaveTextContent(
      "Usage limit reached, so it can't be redeemed.",
    );
  });

  it("says a running voucher is redeemable while uses are left", () => {
    // Arrange & Act
    renderCard({ used: 2, usageLimit: 3 });

    // Assert
    expect(screen.getByTestId("voucher-redemptions-schedule")).toHaveTextContent("Redeemable now.");
  });

  it("still gives the start date for a voucher that hasn't started", () => {
    // Arrange & Act
    renderCard({
      used: 0,
      usageLimit: 0,
      scheduleData: { ...running, startDate: "2099-01-01" },
    });

    // Assert
    expect(screen.getByTestId("voucher-redemptions-schedule")).toHaveTextContent(
      /^Redeemable from /,
    );
  });
});
