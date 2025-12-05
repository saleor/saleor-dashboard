import { OrderFixture } from "@dashboard/orders/fixtures/OrderFixture";
import Wrapper from "@test/wrapper";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import OrderCustomer from "./OrderCustomer";

// Mocks
jest.mock("@dashboard/components/AddressFormatter", () => ({
  __esModule: true,
  default: () => <div>AddressFormatter</div>,
}));
jest.mock("@dashboard/components/RequirePermissions", () => ({
  __esModule: true,
  default: ({ children }: any) => <>{children}</>,
}));
jest.mock("./CustomerEditForm", () => ({
  CustomerEditForm: () => <div data-test-id="customer-edit-form">CustomerEditForm</div>,
}));
jest.mock("./PickupAnnotation", () => ({
  PickupAnnotation: () => <div>PickupAnnotation</div>,
}));
jest.mock("./AddressTextError", () => ({
  AddressTextError: () => <div>AddressTextError</div>,
}));

const mockCopy = jest.fn();

jest.mock("@dashboard/hooks/useClipboard", () => ({
  useClipboard: () => [false, mockCopy],
}));

// We can mock Card but maybe we want to check if it renders?
// If DashboardCard uses complex logic, we mock it. It seems largely presentational.
// For now, I'll keep it mocked to isolate OrderCustomer logic, consistent with unit testing.
// However, if I remove macaw-ui-next mocks, I might as well try removing this one if it's simple.
// But DashboardCard comes from @dashboard/components/Card, so let's keep it mocked for now
// to avoid pulling in its dependencies.
jest.mock("@dashboard/components/Card", () => ({
  DashboardCard: Object.assign(({ children }: any) => <div>{children}</div>, {
    Header: ({ children }: any) => <div>{children}</div>,
    Title: ({ children }: any) => <div>{children}</div>,
    Toolbar: ({ children }: any) => <div>{children}</div>,
    Content: ({ children }: any) => <div>{children}</div>,
  }),
}));

// Removing manual macaw-ui-next mocks to rely on real components (or global mocks if they exist)
// This aligns with OrderSummary.test.tsx pattern.

describe("OrderCustomer", () => {
  const defaultProps = {
    order: OrderFixture.fulfilled().build(),
    loading: false,
    errors: [],
    canEditAddresses: true,
    canEditCustomer: true,
    onCustomerEdit: jest.fn(),
    onProfileView: jest.fn(),
    onBillingAddressEdit: jest.fn(),
    onShippingAddressEdit: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders customer details in view mode", () => {
    render(
      <Wrapper>
        <MemoryRouter>
          <OrderCustomer {...defaultProps} />
        </MemoryRouter>
      </Wrapper>,
    );

    expect(screen.getByText("Customer details")).toBeInTheDocument();
    expect(screen.getByText("Customer")).toBeInTheDocument();
    expect(screen.getByText("Shipping address")).toBeInTheDocument();
    expect(screen.getByText("Billing address")).toBeInTheDocument();
    // Default order fixture has userEmail "customer@example.com"
    expect(screen.getByText("customer@example.com")).toBeInTheDocument();
  });

  it("toggles edit mode", () => {
    render(
      <Wrapper>
        <MemoryRouter>
          <OrderCustomer {...defaultProps} />
        </MemoryRouter>
      </Wrapper>,
    );

    const editButton = screen.getByTestId("edit-customer");

    fireEvent.click(editButton);

    expect(screen.getByTestId("customer-edit-form")).toBeInTheDocument();
  });

  it("renders Not set when no customer", () => {
    const order = OrderFixture.fulfilled().build();

    order.user = null;
    order.userEmail = null;

    render(
      <Wrapper>
        <MemoryRouter>
          <OrderCustomer {...defaultProps} order={order} />
        </MemoryRouter>
      </Wrapper>,
    );

    // There are multiple "Not set" texts (customer, shipping, billing potentially)
    // We check if at least one exists for customer section or generally in the document
    const notSetElements = screen.getAllByText("Not set");

    expect(notSetElements.length).toBeGreaterThan(0);
  });

  it("renders shipping address", () => {
    render(
      <Wrapper>
        <MemoryRouter>
          <OrderCustomer {...defaultProps} />
        </MemoryRouter>
      </Wrapper>,
    );

    expect(screen.getAllByText("AddressFormatter")[0]).toBeInTheDocument();
  });

  it("renders same as shipping address for billing when they match", () => {
    const order = OrderFixture.fulfilled().build();

    // Ensure billing and shipping are same (id matching)
    order.billingAddress = { ...order.shippingAddress!, id: "addr1" };
    order.shippingAddress = { ...order.shippingAddress!, id: "addr1" };

    render(
      <Wrapper>
        <MemoryRouter>
          <OrderCustomer {...defaultProps} order={order} />
        </MemoryRouter>
      </Wrapper>,
    );

    expect(screen.getByText("Same as shipping address")).toBeInTheDocument();
  });

  it("renders edit buttons when permissions allowed", () => {
    render(
      <Wrapper>
        <MemoryRouter>
          <OrderCustomer {...defaultProps} />
        </MemoryRouter>
      </Wrapper>,
    );

    expect(screen.getByTestId("edit-customer")).toBeInTheDocument();
    expect(screen.getByTestId("edit-shipping-address")).toBeInTheDocument();
    expect(screen.getByTestId("edit-billing-address")).toBeInTheDocument();
  });

  it("disables edit customer button if onCustomerEdit is not provided", () => {
    render(
      <Wrapper>
        <MemoryRouter>
          <OrderCustomer {...defaultProps} onCustomerEdit={undefined} />
        </MemoryRouter>
      </Wrapper>,
    );

    expect(screen.getByTestId("edit-customer")).toBeDisabled();
  });

  it("copies email to clipboard", () => {
    render(
      <Wrapper>
        <MemoryRouter>
          <OrderCustomer {...defaultProps} />
        </MemoryRouter>
      </Wrapper>,
    );

    const emailText = screen.getByText("customer@example.com");

    // The onMouseEnter is on the parent Box of the email text
    fireEvent.mouseEnter(emailText.parentElement!);

    const copyButtons = screen.getAllByLabelText("Copy to clipboard");

    // First one should be email
    fireEvent.click(copyButtons[0]);

    expect(mockCopy).toHaveBeenCalledWith("customer@example.com");
  });
});
