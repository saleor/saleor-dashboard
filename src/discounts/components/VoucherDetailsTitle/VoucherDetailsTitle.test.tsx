import { voucherDetails } from "@dashboard/discounts/fixtures";
import { type VoucherDetailsFragment } from "@dashboard/graphql";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";

import { VoucherDetailsTitle } from "./VoucherDetailsTitle";

const endingNextYear: VoucherDetailsFragment = {
  ...voucherDetails,
  startDate: "2020-01-01T00:00:00+00:00",
  endDate: "2099-01-01T00:00:00+00:00",
};

describe("VoucherDetailsTitle", () => {
  it("shows a running voucher with every use taken as used up", () => {
    // Arrange & Act
    render(<VoucherDetailsTitle voucher={{ ...endingNextYear, usageLimit: 5, used: 5 }} />, {
      wrapper: Wrapper,
    });

    // Assert
    expect(screen.getByTestId("voucher-status-info")).toHaveTextContent("Used up");
  });

  it("shows a running voucher with uses left as active", () => {
    // Arrange & Act
    render(<VoucherDetailsTitle voucher={{ ...endingNextYear, usageLimit: 5, used: 4 }} />, {
      wrapper: Wrapper,
    });

    // Assert
    expect(screen.getByTestId("voucher-status-info")).toHaveTextContent("Active");
  });
});
