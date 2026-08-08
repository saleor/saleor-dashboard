import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";

import { type VoucherSetupReadiness } from "./getVoucherSetupReadiness";
import { VoucherSetupCard } from "./VoucherSetupCard";

const incompleteReadiness: VoucherSetupReadiness = {
  hasCodes: false,
  hasChannels: false,
  hasDiscountValue: false,
  needsCatalogue: false,
  hasCatalogue: true,
  needsCountries: false,
  hasCountries: true,
  codesCount: 0,
  channelCount: 0,
  catalogueCount: 0,
  countriesCount: 0,
  coreReady: false,
};

describe("VoucherSetupCard", () => {
  it("shows the first incomplete redeem step as the primary CTA", () => {
    // Arrange & Act
    render(
      <VoucherSetupCard
        readiness={incompleteReadiness}
        onManageChannels={jest.fn()}
        onDismiss={jest.fn()}
      />,
      { wrapper: Wrapper },
    );

    // Assert
    expect(screen.getByTestId("voucher-setup-card")).toBeInTheDocument();
    expect(screen.getByTestId("setup-add-codes")).toBeInTheDocument();
    expect(screen.getByTestId("setup-checklist-progress")).toHaveTextContent("0 of 3");
  });

  it("uses create-oriented copy when variant is create", () => {
    // Arrange & Act
    render(
      <VoucherSetupCard
        variant="create"
        readiness={incompleteReadiness}
        onManageChannels={jest.fn()}
      />,
      { wrapper: Wrapper },
    );

    // Assert
    expect(screen.getByText("Set up this voucher")).toBeInTheDocument();
    expect(
      screen.getByText("Complete the required steps below before Save becomes available."),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("setup-dismiss")).not.toBeInTheDocument();
  });

  it("includes the catalogue task when the voucher is specific-product scoped", () => {
    // Arrange & Act
    render(
      <VoucherSetupCard
        readiness={{
          ...incompleteReadiness,
          hasCodes: true,
          hasChannels: true,
          hasDiscountValue: true,
          needsCatalogue: true,
          hasCatalogue: false,
          codesCount: 1,
          channelCount: 1,
          coreReady: false,
        }}
        onManageChannels={jest.fn()}
      />,
      { wrapper: Wrapper },
    );

    // Assert
    expect(screen.getByTestId("setup-assign-catalogue")).toBeInTheDocument();
    expect(screen.getByTestId("setup-checklist-progress")).toHaveTextContent("3 of 4");
  });

  it("includes countries instead of discount value for free-shipping vouchers", () => {
    // Arrange & Act
    render(
      <VoucherSetupCard
        readiness={{
          ...incompleteReadiness,
          hasCodes: true,
          hasChannels: true,
          hasDiscountValue: true,
          needsCountries: true,
          hasCountries: false,
          codesCount: 1,
          channelCount: 1,
          // Worldwide (empty countries) is redeemable — countries counts as done.
          coreReady: true,
        }}
        onManageChannels={jest.fn()}
      />,
      { wrapper: Wrapper },
    );

    // Assert
    expect(screen.getByTestId("setup-review-countries")).toBeInTheDocument();
    expect(screen.queryByTestId("setup-set-discount")).not.toBeInTheDocument();
    expect(screen.getByTestId("setup-checklist-progress")).toHaveTextContent("3 of 3");
    expect(screen.getByText(/Worldwide/i)).toBeInTheDocument();
  });
});
