import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import DiscountSection from ".";

// `@sentry/react` is auto-mocked in the test setup, which turns the Sentry-wrapped
// `Route` from the shared Router module into `undefined`. Use the plain react-router
// `Route` instead so routing actually resolves.
jest.mock("@dashboard/components/Router", () => ({
  Route: jest.requireActual("react-router-dom").Route,
}));

// The list views are wrapped in filter providers that expect Apollo. This test only
// exercises routing, so pass the children straight through.
jest.mock("@dashboard/components/ConditionalFilter", () => ({
  ConditionalDiscountFilterProvider: ({ children }: { children: React.ReactNode }) => children,
  ConditionalVoucherFilterProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock("./views/DiscountList", () => ({
  DiscountList: () => <div data-test-id="promotion-list-view" />,
}));
jest.mock("./views/DiscountDetails", () => ({
  DiscountDetails: () => <div data-test-id="promotion-details-view" />,
}));
jest.mock("./views/DiscountCreate", () => ({
  DiscountCreate: () => <div data-test-id="promotion-create-view" />,
}));
jest.mock("./views/VoucherList", () => ({
  __esModule: true,
  default: () => <div data-test-id="voucher-list-view" />,
}));
jest.mock("./views/VoucherDetails", () => ({
  __esModule: true,
  default: () => <div data-test-id="voucher-details-view" />,
}));
jest.mock("./views/VoucherCreate", () => ({
  __esModule: true,
  default: () => <div data-test-id="voucher-create-view" />,
}));

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <DiscountSection />
    </MemoryRouter>,
  );

describe("DiscountSection routing", () => {
  it("redirects the section root to the promotions list (regression: /discounts rendered a blank page)", () => {
    // Arrange & Act
    renderAt("/discounts");

    // Assert
    expect(screen.getByTestId("promotion-list-view")).toBeInTheDocument();
  });

  it("redirects the section root to the promotions list regardless of a trailing slash", () => {
    // Arrange & Act
    renderAt("/discounts/");

    // Assert
    expect(screen.getByTestId("promotion-list-view")).toBeInTheDocument();
  });

  it("keeps rendering the vouchers list on its own path", () => {
    // Arrange & Act
    renderAt("/discounts/vouchers");

    // Assert
    expect(screen.getByTestId("voucher-list-view")).toBeInTheDocument();
    expect(screen.queryByTestId("promotion-list-view")).not.toBeInTheDocument();
  });

  it("keeps rendering the voucher details view on its own path", () => {
    // Arrange & Act
    renderAt("/discounts/vouchers/dm91Y2hlcjox");

    // Assert
    expect(screen.getByTestId("voucher-details-view")).toBeInTheDocument();
    expect(screen.queryByTestId("promotion-list-view")).not.toBeInTheDocument();
  });
});
