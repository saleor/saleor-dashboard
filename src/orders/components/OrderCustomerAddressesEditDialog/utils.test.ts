import {
  AccountErrorCode,
  type AccountErrorFragment,
  AddressTypeEnum,
  OrderErrorCode,
  type OrderErrorFragment,
} from "@dashboard/graphql";
import { type IntlShape } from "react-intl";

import { AddressEditDialogVariant } from "./types";
import { getAddressSectionErrors, getOrderLevelErrorMessage, getOrderLevelErrors } from "./utils";

const intl = {
  formatMessage: (
    descriptor: { defaultMessage?: string },
    values?: Record<string, string>,
  ): string => {
    let message = descriptor.defaultMessage ?? "";

    if (values) {
      Object.entries(values).forEach(([key, value]) => {
        message = message.replace(new RegExp(`\\{${key}\\}`, "g"), value);
      });
    }

    return message;
  },
} as IntlShape;

const createOrderError = (overrides: Partial<OrderErrorFragment> = {}): OrderErrorFragment => ({
  __typename: "OrderError",
  code: OrderErrorCode.REQUIRED,
  field: null,
  addressType: null,
  message: "This field cannot be blank",
  orderLines: null,
  ...overrides,
});

const createAccountError = (
  overrides: Partial<AccountErrorFragment> = {},
): AccountErrorFragment => ({
  __typename: "AccountError",
  code: AccountErrorCode.REQUIRED,
  field: null,
  addressType: null,
  message: "This field cannot be blank",
  ...overrides,
});

describe("OrderCustomerAddressesEditDialog utils", () => {
  describe("getOrderLevelErrors", () => {
    it("returns errors for non-address order fields", () => {
      // Arrange
      const originError = createOrderError({ field: "origin" });

      // Act
      const orderLevelErrors = getOrderLevelErrors([originError]);

      // Assert
      expect(orderLevelErrors).toEqual([originError]);
    });

    it("excludes typed shipping and billing address errors", () => {
      // Arrange
      const shippingError = createOrderError({
        field: "city",
        addressType: AddressTypeEnum.SHIPPING,
      });
      const billingError = createOrderError({
        field: "city",
        addressType: AddressTypeEnum.BILLING,
      });

      // Act
      const orderLevelErrors = getOrderLevelErrors([shippingError, billingError]);

      // Assert
      expect(orderLevelErrors).toEqual([]);
    });

    it("excludes untyped address form field errors", () => {
      // Arrange
      const cityError = createOrderError({ field: "city" });

      // Act
      const orderLevelErrors = getOrderLevelErrors([cityError]);

      // Assert
      expect(orderLevelErrors).toEqual([]);
    });
  });

  describe("getOrderLevelErrorMessage", () => {
    it("explains missing order origin with field name and valid values", () => {
      // Arrange
      const originError = createOrderError({ field: "origin" });

      // Act
      const message = getOrderLevelErrorMessage(originError, intl);

      // Assert
      expect(message).toContain("origin");
      expect(message).toContain("Order.origin");
      expect(message).toContain("CHECKOUT");
      expect(message).not.toBe("This field cannot be blank");
    });

    it("includes field name for other order-level errors", () => {
      // Arrange
      const channelError = createOrderError({
        field: "channel",
        message: "Channel is inactive",
      });

      // Act
      const message = getOrderLevelErrorMessage(channelError, intl);

      // Assert
      expect(message).toContain("channel");
      expect(message).toContain("Channel is inactive");
      expect(message).toContain("not an address field error");
    });
  });

  describe("getAddressSectionErrors", () => {
    it("returns typed shipping errors for the shipping section", () => {
      // Arrange
      const shippingError = createOrderError({
        field: "city",
        addressType: AddressTypeEnum.SHIPPING,
      });
      const billingError = createOrderError({
        field: "city",
        addressType: AddressTypeEnum.BILLING,
      });

      // Act
      const shippingSectionErrors = getAddressSectionErrors(
        [shippingError, billingError],
        AddressTypeEnum.SHIPPING,
        AddressEditDialogVariant.CHANGE_SHIPPING_ADDRESS,
        "shipping",
      );

      // Assert
      expect(shippingSectionErrors).toEqual([shippingError]);
    });

    it("includes untyped address field errors for the active shipping edit variant", () => {
      // Arrange
      const cityError = createOrderError({ field: "city" });
      const originError = createOrderError({ field: "origin" });

      // Act
      const shippingSectionErrors = getAddressSectionErrors(
        [cityError, originError],
        AddressTypeEnum.SHIPPING,
        AddressEditDialogVariant.CHANGE_SHIPPING_ADDRESS,
        "shipping",
      );

      // Assert
      expect(shippingSectionErrors).toEqual([cityError]);
    });

    it("includes account errors for the matching address section", () => {
      // Arrange
      const accountError = createAccountError({
        field: "phone",
        addressType: AddressTypeEnum.BILLING,
      });

      // Act
      const billingSectionErrors = getAddressSectionErrors(
        [accountError],
        AddressTypeEnum.BILLING,
        AddressEditDialogVariant.CHANGE_BILLING_ADDRESS,
        "billing",
      );

      // Assert
      expect(billingSectionErrors).toEqual([accountError]);
    });
  });
});
