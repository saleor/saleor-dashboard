import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { PermissionEnum, WarehouseClickAndCollectOptionEnum } from "@dashboard/graphql";
import { OrderFixture } from "@dashboard/orders/fixtures/OrderFixture";
import Wrapper from "@test/wrapper";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import OrderCustomer from "./OrderCustomer";

// Mocks
jest.mock("@dashboard/components/ReadonlyAddress/ReadonlyAddress", () => ({
  ReadonlyAddress: () => <div>ReadonlyAddress</div>,
}));
jest.mock("@dashboard/auth/hooks/useUserPermissions");
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
    onCustomerChangeClick: jest.fn(),
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
    expect(screen.getByText("Change customer")).toBeInTheDocument();
    expect(screen.getByText("Customer")).toBeInTheDocument();
    expect(screen.getByText("Shipping address")).toBeInTheDocument();
    expect(screen.getByText("Billing address")).toBeInTheDocument();
    // Default order fixture has userEmail "customer@example.com"
    expect(screen.getByText("customer@example.com")).toBeInTheDocument();
  });

  it("opens change customer dialog when button is clicked", () => {
    const onCustomerChangeClick = jest.fn();

    render(
      <Wrapper>
        <MemoryRouter>
          <OrderCustomer {...defaultProps} onCustomerChangeClick={onCustomerChangeClick} />
        </MemoryRouter>
      </Wrapper>,
    );

    fireEvent.click(screen.getByTestId("change-customer"));

    expect(onCustomerChangeClick).toHaveBeenCalled();
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

  it("shows the pickup location instead of a shipping address when collected at a warehouse", () => {
    // Arrange
    const order = OrderFixture.fulfilled().build();

    order.deliveryMethod = {
      __typename: "Warehouse",
      id: "warehouse-1",
      clickAndCollectOption: WarehouseClickAndCollectOptionEnum.LOCAL,
    };
    order.collectionPointName = "Downtown warehouse";
    order.shippingAddress = {
      ...order.shippingAddress!,
      firstName: "Regina",
      lastName: "Larson",
      streetAddress1: "799 Cedar Ln",
    };

    // Act
    render(
      <Wrapper>
        <MemoryRouter>
          <OrderCustomer {...defaultProps} order={order} />
        </MemoryRouter>
      </Wrapper>,
    );

    // Assert
    expect(screen.getByTestId("shipping-address-section-title")).toHaveTextContent(
      "Pickup location",
    );
    expect(screen.getByTestId("pickup-location-name")).toHaveTextContent("Downtown warehouse");
    expect(screen.getByTestId("pickup-location-stock-rule")).toHaveTextContent(
      "Uses this location's stock only",
    );
    expect(screen.getByText("799 Cedar Ln")).toBeInTheDocument();
    expect(screen.queryByText("Regina Larson")).not.toBeInTheDocument();
  });

  it("copies the pickup location name and address, without the warehouse contact name", () => {
    // Arrange
    const order = OrderFixture.fulfilled().build();

    order.deliveryMethod = {
      __typename: "Warehouse",
      id: "warehouse-1",
      clickAndCollectOption: WarehouseClickAndCollectOptionEnum.LOCAL,
    };
    order.collectionPointName = "Downtown warehouse";
    order.shippingAddress = {
      ...order.shippingAddress!,
      firstName: "Regina",
      lastName: "Larson",
      companyName: "Saleor",
      streetAddress1: "799 Cedar Ln",
      streetAddress2: "",
      postalCode: "10001",
      city: "NEW YORK",
      cityArea: "",
      countryArea: "NY",
      phone: "+1 212 555 0142",
      country: {
        __typename: "CountryDisplay",
        code: "US",
        country: "United States of America",
      },
    };

    render(
      <Wrapper>
        <MemoryRouter>
          <OrderCustomer {...defaultProps} order={order} />
        </MemoryRouter>
      </Wrapper>,
    );

    // Act
    const section = screen.getByTestId("shipping-address-section");

    fireEvent.click(within(section).getByRole("button", { name: "Copy to clipboard" }));

    // Assert
    expect(mockCopy).toHaveBeenCalledWith(
      [
        "Downtown warehouse",
        "Saleor",
        "799 Cedar Ln",
        "10001 NEW YORK",
        "NY, United States of America",
        "+1 212 555 0142",
      ].join("\n"),
    );
  });

  it("explains that stock can come from any warehouse for pickup with transfers", () => {
    // Arrange
    const order = OrderFixture.fulfilled().build();

    order.deliveryMethod = {
      __typename: "Warehouse",
      id: "warehouse-1",
      clickAndCollectOption: WarehouseClickAndCollectOptionEnum.ALL,
    };

    // Act
    render(
      <Wrapper>
        <MemoryRouter>
          <OrderCustomer {...defaultProps} order={order} />
        </MemoryRouter>
      </Wrapper>,
    );

    // Assert
    expect(screen.getByTestId("pickup-location-stock-rule")).toHaveTextContent(
      "Stock can come from any warehouse",
    );
  });

  it("says billing matches pickup when both addresses are the warehouse", () => {
    // Arrange
    const order = OrderFixture.fulfilled().build();

    order.deliveryMethod = {
      __typename: "Warehouse",
      id: "warehouse-1",
      clickAndCollectOption: WarehouseClickAndCollectOptionEnum.ALL,
    };
    order.billingAddress = { ...order.shippingAddress!, id: "addr1" };
    order.shippingAddress = { ...order.shippingAddress!, id: "addr1" };

    // Act
    render(
      <Wrapper>
        <MemoryRouter>
          <OrderCustomer {...defaultProps} order={order} />
        </MemoryRouter>
      </Wrapper>,
    );

    // Assert
    expect(screen.getByText("Same as pickup")).toBeInTheDocument();
    expect(screen.queryByText("Same as shipping address")).not.toBeInTheDocument();
  });

  it("renders shipping address", () => {
    render(
      <Wrapper>
        <MemoryRouter>
          <OrderCustomer {...defaultProps} />
        </MemoryRouter>
      </Wrapper>,
    );

    expect(screen.getAllByText("ReadonlyAddress")[0]).toBeInTheDocument();
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

    expect(screen.getByTestId("change-customer")).toBeInTheDocument();
    expect(screen.getByTestId("edit-shipping-address")).toBeInTheDocument();
    expect(screen.getByTestId("edit-billing-address")).toBeInTheDocument();
  });

  it("hides the address edit for a pickup location but keeps billing editable", () => {
    // Arrange
    const order = OrderFixture.fulfilled().build();

    order.deliveryMethod = {
      __typename: "Warehouse",
      id: "warehouse-1",
      clickAndCollectOption: WarehouseClickAndCollectOptionEnum.LOCAL,
    };

    // Act
    render(
      <Wrapper>
        <MemoryRouter>
          <OrderCustomer {...defaultProps} order={order} />
        </MemoryRouter>
      </Wrapper>,
    );

    // Assert
    expect(screen.queryByTestId("edit-shipping-address")).not.toBeInTheDocument();
    expect(screen.getByTestId("edit-billing-address")).toBeInTheDocument();
  });

  it("disables change customer button if onCustomerChangeClick is not provided", () => {
    render(
      <Wrapper>
        <MemoryRouter>
          <OrderCustomer {...defaultProps} onCustomerChangeClick={undefined} />
        </MemoryRouter>
      </Wrapper>,
    );

    expect(screen.getByTestId("change-customer")).toBeDisabled();
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

    it("shows View orders and View profile links when user has only MANAGE_ORDERS permission", () => {
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
      expect(screen.getByText("View profile")).toBeInTheDocument();
    });

    it("shows View profile link when user has only MANAGE_STAFF permission", () => {
      // Arrange
      (useUserPermissions as jest.Mock).mockReturnValue([{ code: PermissionEnum.MANAGE_STAFF }]);

      // Act
      render(
        <Wrapper>
          <MemoryRouter>
            <OrderCustomer {...defaultProps} />
          </MemoryRouter>
        </Wrapper>,
      );

      // Assert
      expect(screen.getByText("View profile")).toBeInTheDocument();
    });

    it("hides View profile link when user has none of MANAGE_USERS / MANAGE_ORDERS / MANAGE_STAFF", () => {
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
