import { type CustomerDetailsFragment } from "@dashboard/graphql";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import { type ComponentProps } from "react";
import { MemoryRouter } from "react-router-dom";

import { customer } from "../../fixtures";
import CustomerAddresses from "./CustomerAddresses";

const renderAddresses = (
  props?: Partial<ComponentProps<typeof CustomerAddresses>>,
): ReturnType<typeof render> =>
  render(
    <Wrapper>
      <MemoryRouter>
        <CustomerAddresses
          customer={customer as CustomerDetailsFragment}
          disabled={false}
          manageAddressHref="/customers/1/addresses"
          {...props}
        />
      </MemoryRouter>
    </Wrapper>,
  );

describe("CustomerAddresses", () => {
  it("shows a skeleton while the customer is loading, not an empty address book", () => {
    // Arrange / Act
    renderAddresses({ customer: undefined, disabled: true });

    // Assert
    expect(screen.getByTestId("customer-addresses-loading")).toBeInTheDocument();
    expect(screen.queryByText(/no addresses yet/i)).not.toBeInTheDocument();
    expect(screen.getByTestId("manage-addresses")).toBeDisabled();
    expect(screen.getByTestId("manage-addresses").closest("a")).toBeNull();
  });

  it("shows the dashed empty state when the customer has no addresses", () => {
    // Arrange / Act
    renderAddresses({
      customer: {
        ...customer,
        defaultBillingAddress: null,
        defaultShippingAddress: null,
      } as CustomerDetailsFragment,
    });

    // Assert
    expect(screen.getByText(/no addresses yet/i)).toBeInTheDocument();
  });

  it("links Manage to the address book once the customer is loaded", () => {
    // Arrange / Act
    renderAddresses();

    // Assert
    expect(screen.getByTestId("manage-addresses").closest("a")).toHaveAttribute(
      "href",
      "/customers/1/addresses",
    );
  });
});
