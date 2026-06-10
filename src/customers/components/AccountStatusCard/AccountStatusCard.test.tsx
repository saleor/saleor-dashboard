import { type CustomerDetailsFragment } from "@dashboard/graphql";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";

import { AccountStatusCard } from "./AccountStatusCard";

const baseCustomer: CustomerDetailsFragment = {
  __typename: "User",
  id: "VXNlcjox",
  email: "test@example.com",
  firstName: "Test",
  lastName: "User",
  dateJoined: "2024-01-01T00:00:00Z",
  lastLogin: null,
  note: null,
  isActive: true,
  isConfirmed: true,
  isStaff: false,
  externalReference: null,
  defaultShippingAddress: null,
  defaultBillingAddress: null,
};

const renderCard = (props: { customer?: CustomerDetailsFragment | null }) =>
  render(<AccountStatusCard {...props} />, { wrapper: Wrapper });

describe("AccountStatusCard", () => {
  it("renders the Active and Verified pills for an active confirmed customer", () => {
    // Arrange / Act
    renderCard({ customer: { ...baseCustomer, isActive: true, isConfirmed: true } });

    // Assert
    expect(screen.getByTestId("account-status-active")).toBeInTheDocument();
    expect(screen.getByTestId("account-status-email-verified")).toBeInTheDocument();
    expect(screen.queryByTestId("account-status-inactive")).not.toBeInTheDocument();
    expect(screen.queryByTestId("account-status-email-unverified")).not.toBeInTheDocument();
  });

  it("renders the Inactive pill when the account is deactivated", () => {
    // Arrange / Act
    renderCard({ customer: { ...baseCustomer, isActive: false, isConfirmed: true } });

    // Assert
    expect(screen.getByTestId("account-status-inactive")).toBeInTheDocument();
    expect(screen.queryByTestId("account-status-active")).not.toBeInTheDocument();
    expect(screen.getByTestId("account-status-email-verified")).toBeInTheDocument();
  });

  it("renders the Unverified email pill when the customer has not confirmed", () => {
    // Arrange / Act
    renderCard({ customer: { ...baseCustomer, isActive: true, isConfirmed: false } });

    // Assert
    expect(screen.getByTestId("account-status-email-unverified")).toBeInTheDocument();
    expect(screen.queryByTestId("account-status-email-verified")).not.toBeInTheDocument();
  });

  it("renders skeleton placeholders while customer is loading", () => {
    // Arrange / Act
    const { container } = renderCard({ customer: null });

    // Assert - no pills are rendered while loading
    expect(screen.queryByTestId("account-status-active")).not.toBeInTheDocument();
    expect(screen.queryByTestId("account-status-inactive")).not.toBeInTheDocument();
    expect(screen.queryByTestId("account-status-email-verified")).not.toBeInTheDocument();
    expect(screen.queryByTestId("account-status-email-unverified")).not.toBeInTheDocument();
    // Card frame is still rendered so the sidebar layout doesn't reflow.
    expect(container.querySelector('[data-test-id="account-status"]')).toBeInTheDocument();
  });
});
