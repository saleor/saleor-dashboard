import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { PermissionEnum } from "@dashboard/graphql";
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
jest.mock("@dashboard/auth/hooks/useUserPermissions");
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

jest.mock("@dashboard/components/Card", () => ({
  DashboardCard: Object.assign(({ children }: any) => <div>{children}</div>, {
    Header: ({ children }: any) => <div>{children}</div>,
    Title: ({ children }: any) => <div>{children}</div>,
    Toolbar: ({ children }: any) => <div>{children}</div>,
    Content: ({ children }: any) => <div>{children}</div>,
  }),
}));

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
    // Default: user has all relevant permissions
    (useUserPermissions as jest.Mock).mockReturnValue([
      { code: PermissionEnum.MANAGE_ORDERS },
      { code: PermissionEnum.MANAGE_USERS },
    ]);
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

    fireEvent.mouseEnter(emailText.parentElement!);

    const copyButtons = screen.getAllByLabelText("Copy to clipboard");

    fireEvent.click(copyButtons[0]);

    expect(mockCopy).toHaveBeenCalledWith("customer@example.com");
  });

  describe("permission-based visibility", () => {
    it("shows View orders link and View profile link when user has MANAGE_USERS permission", () => {
      // Arrange
      (useUserPermissions as jest.Mock).mockReturnValue([
        { code: PermissionEnum.MANAGE_ORDERS },
        { code: PermissionEnum.MANAGE_USERS },
      ]);

      // Act
      render(
        <Wrapper>
          <MemoryRouter>
            <OrderCustomer {...defaultProps} />
          </MemoryRouter>
        </Wrapper>,
      );

      // Assert
      expect(screen.getByText("View orders")).toBeInTheDocument();
      expect(screen.getByText("View profile")).toBeInTheDocument();
    });

    it("shows View orders link but hides View profile link when user has only MANAGE_ORDERS permission", () => {
      // Arrange
      (useUserPermissions as jest.Mock).mockReturnValue([{ code: PermissionEnum.MANAGE_ORDERS }]);

      // Act
      render(
        <Wrapper>
          <MemoryRouter>
            <OrderCustomer {...defaultProps} />
          </MemoryRouter>
        </Wrapper>,
      );

      // Assert
      expect(screen.getByText("View orders")).toBeInTheDocument();
      expect(screen.queryByText("View profile")).not.toBeInTheDocument();
    });

    it("hides View profile link when user has no MANAGE_USERS permission", () => {
      // Arrange
      (useUserPermissions as jest.Mock).mockReturnValue([]);

      // Act
      render(
        <Wrapper>
          <MemoryRouter>
            <OrderCustomer {...defaultProps} />
          </MemoryRouter>
        </Wrapper>,
      );

      // Assert
      expect(screen.queryByText("View profile")).not.toBeInTheDocument();
    });
  });
});
