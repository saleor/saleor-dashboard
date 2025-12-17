import { DiscountValueTypeEnum, OrderDetailsFragment, OrderDiscountType } from "@dashboard/graphql";
import { prepareMoney } from "@dashboard/orders/fixtures";
import { OrderDiscountData } from "@dashboard/products/components/OrderDiscountProviders/types";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { OrderValue } from "./OrderValue";

type BaseOrderValueProps = {
  orderSubtotal: OrderDetailsFragment["subtotal"];
  shippingMethodName: OrderDetailsFragment["shippingMethodName"];
  shippingPrice: OrderDetailsFragment["shippingPrice"];
  orderTotal: OrderDetailsFragment["total"];
  discounts: OrderDetailsFragment["discounts"];
  giftCardsAmount: number | null;
  usedGiftCards: OrderDetailsFragment["giftCards"] | null;
  displayGrossPrices: OrderDetailsFragment["displayGrossPrices"];
};

const baseProps: BaseOrderValueProps = {
  orderSubtotal: {
    __typename: "TaxedMoney",
    gross: { __typename: "Money", amount: 100, currency: "USD" },
    net: { __typename: "Money", amount: 100, currency: "USD" },
  },
  shippingMethodName: null,
  shippingPrice: {
    __typename: "TaxedMoney",
    gross: { __typename: "Money", amount: 10, currency: "USD" },
  },
  orderTotal: {
    __typename: "TaxedMoney",
    gross: { __typename: "Money", amount: 110, currency: "USD" },
    net: { __typename: "Money", amount: 110, currency: "USD" },
    tax: { __typename: "Money", amount: 0, currency: "USD" },
  },
  discounts: [],
  giftCardsAmount: null,
  usedGiftCards: null,
  displayGrossPrices: true,
};

const shippingAddress: OrderDetailsFragment["shippingAddress"] = {
  __typename: "Address",
  id: "address-1",
  city: "New York",
  cityArea: "",
  companyName: "",
  country: { __typename: "CountryDisplay", code: "US", country: "United States" },
  countryArea: "NY",
  firstName: "John",
  lastName: "Doe",
  phone: "+1234567890",
  postalCode: "10001",
  streetAddress1: "123 Main St",
  streetAddress2: "",
};

const shippingMethod: OrderDetailsFragment["shippingMethod"] = {
  __typename: "ShippingMethod",
  id: "shipping-method-1",
};

const shippingMethods: OrderDetailsFragment["shippingMethods"] = [
  {
    __typename: "ShippingMethod",
    id: "shipping-method-1",
    name: "Standard Shipping",
    price: { __typename: "Money", amount: 10, currency: "USD" },
    active: true,
    message: null,
  },
  {
    __typename: "ShippingMethod",
    id: "shipping-method-2",
    name: "Express Shipping",
    price: { __typename: "Money", amount: 25, currency: "USD" },
    active: true,
    message: null,
  },
];

const createEditableProps = (overrides: Partial<Parameters<typeof OrderValue>[0]> = {}) => ({
  ...baseProps,
  isEditable: true as const,
  orderDiscount: undefined,
  addOrderDiscount: jest.fn(),
  removeOrderDiscount: jest.fn(),
  openDialog: jest.fn(),
  closeDialog: jest.fn(),
  isDialogOpen: false,
  orderDiscountAddStatus: "default" as const,
  orderDiscountRemoveStatus: "default" as const,
  undiscountedPrice: prepareMoney(110),
  onShippingMethodEdit: jest.fn(),
  shippingMethods: [],
  shippingMethod: null,
  shippingAddress: null,
  isShippingRequired: true,
  errors: [],
  ...overrides,
});

describe("OrderValue", () => {
  describe("Read-only mode", () => {
    it("should render shipping method name as text when not editable", () => {
      // Arrange
      const props = {
        ...baseProps,
        shippingMethodName: "Standard Shipping",
      };

      // Act
      render(
        <Wrapper>
          <OrderValue {...props} />
        </Wrapper>,
      );

      // Assert
      expect(screen.getByText("Shipping")).toBeInTheDocument();
      expect(screen.getByText("Standard Shipping")).toBeInTheDocument();
    });

    it("should render discounts as text when not editable", () => {
      // Arrange
      const props = {
        ...baseProps,
        discounts: [
          {
            __typename: "OrderDiscount" as const,
            id: "discount-1",
            name: "Summer Sale",
            amount: { __typename: "Money" as const, amount: 15, currency: "USD" },
            type: OrderDiscountType.MANUAL,
            calculationMode: DiscountValueTypeEnum.FIXED,
            value: 15,
            reason: null,
          },
        ],
      };

      // Act
      render(
        <Wrapper>
          <OrderValue {...props} />
        </Wrapper>,
      );

      // Assert
      expect(screen.getByText("Discount")).toBeInTheDocument();
      expect(screen.getByText("Summer Sale")).toBeInTheDocument();
    });
  });

  describe("Editable mode - Shipping", () => {
    it("should show 'No shipping address' when shipping address is not set", () => {
      // Arrange
      const props = createEditableProps({
        shippingAddress: null,
        shippingMethods: shippingMethods,
        isShippingRequired: true,
      });

      // Act
      render(
        <Wrapper>
          <OrderValue {...props} />
        </Wrapper>,
      );

      // Assert
      expect(screen.getByText("No shipping address")).toBeInTheDocument();
      expect(screen.queryByText("Set shipping method")).not.toBeInTheDocument();
    });

    it("should show 'No applicable shipping methods' when address is set but no methods available", () => {
      // Arrange
      const props = createEditableProps({
        shippingAddress,
        shippingMethods: [],
        isShippingRequired: false,
      });

      // Act
      render(
        <Wrapper>
          <OrderValue {...props} />
        </Wrapper>,
      );

      // Assert
      expect(screen.getByText("No applicable shipping methods")).toBeInTheDocument();
      expect(screen.queryByText("Set shipping method")).not.toBeInTheDocument();
    });

    it("should show 'Set shipping method' link when address and methods are available", () => {
      // Arrange
      const onShippingMethodEdit = jest.fn();
      const props = createEditableProps({
        shippingAddress,
        shippingMethods,
        isShippingRequired: true,
        onShippingMethodEdit,
      });

      // Act
      render(
        <Wrapper>
          <OrderValue {...props} />
        </Wrapper>,
      );

      // Assert
      const setShippingLink = screen.getByText("Set shipping method");

      expect(setShippingLink).toBeInTheDocument();
      expect(setShippingLink.tagName).toBe("BUTTON");
    });

    it("should call onShippingMethodEdit when 'Set shipping method' link is clicked", async () => {
      // Arrange
      const onShippingMethodEdit = jest.fn();
      const props = createEditableProps({
        shippingAddress,
        shippingMethods,
        isShippingRequired: true,
        onShippingMethodEdit,
      });

      // Act
      render(
        <Wrapper>
          <OrderValue {...props} />
        </Wrapper>,
      );

      const setShippingLink = screen.getByText("Set shipping method");

      await userEvent.click(setShippingLink);

      // Assert
      expect(onShippingMethodEdit).toHaveBeenCalledTimes(1);
    });

    it("should show chosen shipping method as clickable link when alternatives exist", async () => {
      // Arrange
      const onShippingMethodEdit = jest.fn();
      const props = createEditableProps({
        shippingAddress,
        shippingMethods,
        shippingMethod,
        shippingMethodName: "Standard Shipping",
        isShippingRequired: true,
        onShippingMethodEdit,
      });

      // Act
      render(
        <Wrapper>
          <OrderValue {...props} />
        </Wrapper>,
      );

      // Assert
      const methodLink = screen.getByText("Standard Shipping");

      expect(methodLink).toBeInTheDocument();
      expect(methodLink.tagName).toBe("BUTTON");

      await userEvent.click(methodLink);
      expect(onShippingMethodEdit).toHaveBeenCalledTimes(1);
    });

    it("should show chosen shipping method as non-clickable text when no alternatives exist", () => {
      // Arrange
      const onShippingMethodEdit = jest.fn();
      const props = createEditableProps({
        shippingAddress,
        shippingMethods: [],
        shippingMethod,
        shippingMethodName: "Standard Shipping",
        isShippingRequired: false,
        onShippingMethodEdit,
      });

      // Act
      render(
        <Wrapper>
          <OrderValue {...props} />
        </Wrapper>,
      );

      // Assert
      const methodText = screen.getByText("Standard Shipping");

      expect(methodText).toBeInTheDocument();
      expect(methodText.tagName).toBe("SPAN");
      expect(methodText).toHaveAttribute("title", "No alternative shipping methods available");
    });

    it("should prioritize 'No shipping address' over 'No applicable shipping methods'", () => {
      // Arrange
      const props = createEditableProps({
        shippingAddress: null,
        shippingMethods: [],
        isShippingRequired: false,
      });

      // Act
      render(
        <Wrapper>
          <OrderValue {...props} />
        </Wrapper>,
      );

      // Assert
      expect(screen.getByText("No shipping address")).toBeInTheDocument();
      expect(screen.queryByText("No applicable shipping methods")).not.toBeInTheDocument();
    });
  });

  describe("Editable mode - Discount", () => {
    it("should show 'Add Discount' link when no discount is set", () => {
      // Arrange
      const props = createEditableProps({
        shippingAddress,
        shippingMethods,
        orderDiscount: undefined,
      });

      // Act
      render(
        <Wrapper>
          <OrderValue {...props} />
        </Wrapper>,
      );

      // Assert
      expect(screen.getByText("Add Discount")).toBeInTheDocument();
    });

    it("should call openDialog when 'Add Discount' link is clicked", async () => {
      // Arrange
      const openDialog = jest.fn();
      const props = createEditableProps({
        shippingAddress,
        shippingMethods,
        orderDiscount: undefined,
        openDialog,
      });

      // Act
      render(
        <Wrapper>
          <OrderValue {...props} />
        </Wrapper>,
      );

      const addDiscountLink = screen.getByText("Add Discount");

      await userEvent.click(addDiscountLink);

      // Assert
      expect(openDialog).toHaveBeenCalledTimes(1);
    });

    it("should show percentage discount value when discount is percentage type", () => {
      // Arrange
      const orderDiscount: OrderDiscountData = {
        value: 10,
        calculationMode: DiscountValueTypeEnum.PERCENTAGE,
        amount: { __typename: "Money", amount: 11, currency: "USD" },
        reason: "Loyalty discount",
      };
      const props = createEditableProps({
        shippingAddress,
        shippingMethods,
        orderDiscount,
      });

      // Act
      render(
        <Wrapper>
          <OrderValue {...props} />
        </Wrapper>,
      );

      // Assert
      expect(screen.getByText("Discount")).toBeInTheDocument();
      expect(screen.getByText("10%")).toBeInTheDocument();
    });

    it("should show fixed discount value when discount is fixed type", () => {
      // Arrange
      const orderDiscount: OrderDiscountData = {
        value: 15,
        calculationMode: DiscountValueTypeEnum.FIXED,
        amount: { __typename: "Money", amount: 15, currency: "USD" },
        reason: "Special offer",
      };
      const props = createEditableProps({
        shippingAddress,
        shippingMethods,
        orderDiscount,
      });

      // Act
      render(
        <Wrapper>
          <OrderValue {...props} />
        </Wrapper>,
      );

      // Assert
      expect(screen.getByText("Discount")).toBeInTheDocument();
      expect(screen.getByText("Fixed amount")).toBeInTheDocument();
      expect(screen.getByText("15")).toBeInTheDocument();
    });

    it("should show discount reason as tooltip on existing discount", () => {
      // Arrange
      const orderDiscount: OrderDiscountData = {
        value: 10,
        calculationMode: DiscountValueTypeEnum.PERCENTAGE,
        amount: { __typename: "Money", amount: 11, currency: "USD" },
        reason: "Loyalty discount",
      };
      const props = createEditableProps({
        shippingAddress,
        shippingMethods,
        orderDiscount,
      });

      // Act
      render(
        <Wrapper>
          <OrderValue {...props} />
        </Wrapper>,
      );

      // Assert
      const discountLink = screen.getByText("10%");

      expect(discountLink).toHaveAttribute("title", "Loyalty discount");
    });
  });

  describe("Gift cards", () => {
    it("should render gift card row when gift cards are present", () => {
      // Arrange
      const props = {
        ...baseProps,
        giftCardsAmount: 25,
        usedGiftCards: [
          {
            __typename: "GiftCard" as const,
            id: "gc-1",
            last4CodeChars: "ABCD",
            currentBalance: { __typename: "Money" as const, amount: 25, currency: "USD" },
            events: [],
          },
        ],
      };

      // Act
      render(
        <Wrapper>
          <OrderValue {...props} />
        </Wrapper>,
      );

      // Assert - query by the title attribute which is reliably set
      expect(screen.getByTitle("Gift card amount used")).toBeInTheDocument();
      expect(screen.getByText("-25")).toBeInTheDocument();
    });

    it("should render multiple gift cards row", () => {
      // Arrange
      const props = {
        ...baseProps,
        giftCardsAmount: 50,
        usedGiftCards: [
          {
            __typename: "GiftCard" as const,
            id: "gc-1",
            last4CodeChars: "ABCD",
            currentBalance: { __typename: "Money" as const, amount: 25, currency: "USD" },
            events: [],
          },
          {
            __typename: "GiftCard" as const,
            id: "gc-2",
            last4CodeChars: "WXYZ",
            currentBalance: { __typename: "Money" as const, amount: 25, currency: "USD" },
            events: [],
          },
        ],
      };

      // Act
      render(
        <Wrapper>
          <OrderValue {...props} />
        </Wrapper>,
      );

      // Assert
      expect(screen.getByTitle("Gift card amount used")).toBeInTheDocument();
      expect(screen.getByText("-50")).toBeInTheDocument();
    });

    it("should not render gift card section when no gift cards used", () => {
      // Arrange
      const props = {
        ...baseProps,
        giftCardsAmount: 0,
        usedGiftCards: null,
      };

      // Act
      render(
        <Wrapper>
          <OrderValue {...props} />
        </Wrapper>,
      );

      // Assert
      expect(screen.queryByTitle("Gift card amount used")).not.toBeInTheDocument();
    });
  });

  describe("Taxes display", () => {
    it("should show taxes as included when displayGrossPrices is true", () => {
      // Arrange
      const props = {
        ...baseProps,
        displayGrossPrices: true,
        orderTotal: {
          ...baseProps.orderTotal,
          tax: { __typename: "Money" as const, amount: 10, currency: "USD" },
        },
      };

      // Act
      render(
        <Wrapper>
          <OrderValue {...props} />
        </Wrapper>,
      );

      // Assert
      expect(screen.getByText("Taxes")).toBeInTheDocument();
      expect(screen.getByText("(included)")).toBeInTheDocument();
    });

    it("should show taxes without 'included' when displayGrossPrices is false", () => {
      // Arrange
      const props = {
        ...baseProps,
        displayGrossPrices: false,
        orderTotal: {
          ...baseProps.orderTotal,
          tax: { __typename: "Money" as const, amount: 10, currency: "USD" },
        },
      };

      // Act
      render(
        <Wrapper>
          <OrderValue {...props} />
        </Wrapper>,
      );

      // Assert
      expect(screen.getByText("Taxes")).toBeInTheDocument();
      expect(screen.queryByText("(included)")).not.toBeInTheDocument();
    });
  });
});
