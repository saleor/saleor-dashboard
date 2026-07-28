import {
  AccountErrorCode,
  type AccountErrorFragment,
  AddressTypeEnum,
  CountryCode,
  OrderErrorCode,
  type OrderErrorFragment,
} from "@dashboard/graphql";
import { type IntlShape } from "react-intl";

import { AddressEditDialogVariant } from "./types";
import {
  findMatchingCustomerAddress,
  getAddressComparableKey,
  getAddressSectionErrors,
  getOrderLevelErrorMessage,
  getOrderLevelErrors,
  getPreSubmitErrors,
  resolveInitialCustomerAddress,
} from "./utils";

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

  describe("getPreSubmitErrors", () => {
    it("returns account validation errors from address submit payload", () => {
      // Arrange
      const accountError = createAccountError({ field: "city" });
      const input = {
        shippingAddress: [accountError],
        billingAddress: { city: "Wrocław", country: CountryCode.PL },
      };

      // Act
      const errors = getPreSubmitErrors(input);

      // Assert
      expect(errors).toEqual([accountError]);
    });
  });

  describe("findMatchingCustomerAddress", () => {
    const customerAddresses = [
      {
        __typename: "Address" as const,
        id: "addr-default",
        firstName: "John",
        lastName: "Appleseed",
        companyName: "",
        streetAddress1: "1 Infinite Loop",
        streetAddress2: "",
        city: "CUPERTINO",
        cityArea: "",
        countryArea: "",
        postalCode: "95014",
        phone: "",
        country: { __typename: "CountryDisplay" as const, code: "US", country: "United States" },
      },
      {
        __typename: "Address" as const,
        id: "addr-mirek",
        firstName: "Miroslaw",
        lastName: "Mencel",
        companyName: "",
        streetAddress1: "Jagielly 3/33",
        streetAddress2: "",
        city: "WROCŁAW",
        cityArea: "",
        countryArea: "",
        postalCode: "50-201",
        phone: "",
        country: { __typename: "CountryDisplay" as const, code: "PL", country: "Poland" },
      },
    ];

    it("matches order address to customer address by field values", () => {
      // Arrange
      const orderShippingAddress = {
        firstName: "Miroslaw",
        lastName: "Mencel",
        streetAddress1: "Jagielly 3/33",
        city: "WROCŁAW",
        postalCode: "50-201",
        country: "PL",
        phone: "",
      };

      // Act
      const match = findMatchingCustomerAddress(orderShippingAddress, customerAddresses);

      // Assert
      expect(match?.id).toBe("addr-mirek");
    });

    it("returns undefined when order address does not match any customer address", () => {
      // Arrange
      const orderShippingAddress = {
        firstName: "Custom",
        lastName: "Address",
        streetAddress1: "Unknown street",
        city: "City",
        postalCode: "00-000",
        country: "PL",
        phone: "",
      };

      // Act
      const match = findMatchingCustomerAddress(orderShippingAddress, customerAddresses);

      // Assert
      expect(match).toBeUndefined();
    });
  });

  describe("resolveInitialCustomerAddress", () => {
    it("prefers matching order address over customer default address", () => {
      // Arrange
      const customerAddresses = [
        {
          __typename: "Address" as const,
          id: "addr-mirek",
          firstName: "Miroslaw",
          lastName: "Mencel",
          companyName: "",
          streetAddress1: "Jagielly 3/33",
          streetAddress2: "",
          city: "WROCŁAW",
          cityArea: "",
          countryArea: "",
          postalCode: "50-201",
          phone: "",
          country: { __typename: "CountryDisplay" as const, code: "PL", country: "Poland" },
        },
      ];
      const orderShippingAddress = {
        firstName: "Miroslaw",
        lastName: "Mencel",
        streetAddress1: "Jagielly 3/33",
        city: "WROCŁAW",
        postalCode: "50-201",
        country: "PL",
        phone: "",
      };

      // Act
      const resolved = resolveInitialCustomerAddress(orderShippingAddress, customerAddresses, {
        id: "addr-default",
      });

      // Assert
      expect(resolved.id).toBe("addr-mirek");
    });
  });

  describe("getAddressComparableKey", () => {
    it("normalizes casing and whitespace when comparing addresses", () => {
      // Arrange
      const formAddress = {
        firstName: " Miroslaw ",
        lastName: "Mencel",
        streetAddress1: "Jagielly 3/33",
        city: "wrocław",
        postalCode: "50-201",
        country: "pl",
        phone: "",
      };
      const graphqlAddress = {
        firstName: "Miroslaw",
        lastName: "Mencel",
        streetAddress1: "Jagielly 3/33",
        city: "WROCŁAW",
        postalCode: "50-201",
        country: { code: "PL" },
        phone: null,
      };

      // Act
      // Assert
      expect(getAddressComparableKey(formAddress)).toBe(getAddressComparableKey(graphqlAddress));
    });
  });
});
