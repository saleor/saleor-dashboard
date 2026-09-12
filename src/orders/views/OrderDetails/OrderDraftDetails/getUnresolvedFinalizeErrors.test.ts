import {
  type AddressFragment,
  type OrderDetailsFragment,
  OrderErrorCode,
  type OrderErrorFragment,
} from "@dashboard/graphql";

import { getUnresolvedFinalizeErrors } from "./getUnresolvedFinalizeErrors";

type DraftOrder = Pick<
  OrderDetailsFragment,
  "billingAddress" | "shippingAddress" | "shippingMethod"
>;

const address: AddressFragment = {
  __typename: "Address",
  city: "Wrocław",
  cityArea: "",
  companyName: "",
  countryArea: "",
  firstName: "Jan",
  id: "QWRkcmVzczox",
  lastName: "Kowalski",
  phone: null,
  postalCode: "50-001",
  streetAddress1: "Rynek 1",
  streetAddress2: "",
  country: {
    __typename: "CountryDisplay",
    code: "PL",
    country: "Poland",
  },
};

const emptyDraft: DraftOrder = {
  billingAddress: null,
  shippingAddress: null,
  shippingMethod: null,
};

const createError = (code: OrderErrorCode, field: string | null): OrderErrorFragment => ({
  __typename: "OrderError",
  code,
  field,
  addressType: null,
  message: "Error",
  orderLines: null,
});

const noBillingAddress = createError(OrderErrorCode.BILLING_ADDRESS_NOT_SET, "order");
const noShippingAddress = createError(OrderErrorCode.ORDER_NO_SHIPPING_ADDRESS, "order");
const noShippingMethod = createError(OrderErrorCode.SHIPPING_METHOD_REQUIRED, "shipping");

describe("getUnresolvedFinalizeErrors", () => {
  it("keeps every error while the draft is still missing all of the data", () => {
    // Arrange
    const errors = [noBillingAddress, noShippingAddress, noShippingMethod];

    // Act
    const result = getUnresolvedFinalizeErrors(errors, emptyDraft);

    // Assert
    expect(result).toEqual(errors);
  });

  it("drops the billing address error once a billing address is set", () => {
    // Arrange
    const order: DraftOrder = { ...emptyDraft, billingAddress: address };

    // Act
    const result = getUnresolvedFinalizeErrors([noBillingAddress, noShippingAddress], order);

    // Assert
    expect(result).toEqual([noShippingAddress]);
  });

  it("drops the shipping address error once a shipping address is set", () => {
    // Arrange
    const order: DraftOrder = { ...emptyDraft, shippingAddress: address };

    // Act
    const result = getUnresolvedFinalizeErrors([noBillingAddress, noShippingAddress], order);

    // Assert
    expect(result).toEqual([noBillingAddress]);
  });

  it("drops the shipping method error once a shipping method is chosen", () => {
    // Arrange
    const order: DraftOrder = {
      ...emptyDraft,
      shippingMethod: { __typename: "ShippingMethod", id: "U2hpcHBpbmdNZXRob2Q6MQ==" },
    };

    // Act
    const result = getUnresolvedFinalizeErrors([noShippingMethod], order);

    // Assert
    expect(result).toEqual([]);
  });

  it("drops every error once the whole draft is filled in", () => {
    // Arrange
    const order: DraftOrder = {
      billingAddress: address,
      shippingAddress: address,
      shippingMethod: { __typename: "ShippingMethod", id: "U2hpcHBpbmdNZXRob2Q6MQ==" },
    };

    // Act
    const result = getUnresolvedFinalizeErrors(
      [noBillingAddress, noShippingAddress, noShippingMethod],
      order,
    );

    // Assert
    expect(result).toEqual([]);
  });

  it("keeps errors it cannot tell apart from the current draft state", () => {
    // Arrange
    const insufficientStock = createError(OrderErrorCode.INSUFFICIENT_STOCK, "lines");
    const order: DraftOrder = {
      billingAddress: address,
      shippingAddress: address,
      shippingMethod: { __typename: "ShippingMethod", id: "U2hpcHBpbmdNZXRob2Q6MQ==" },
    };

    // Act
    const result = getUnresolvedFinalizeErrors([insufficientStock], order);

    // Assert
    expect(result).toEqual([insufficientStock]);
  });

  it("keeps the errors untouched when the order has not loaded yet", () => {
    // Arrange
    const errors = [noBillingAddress];

    // Act
    const result = getUnresolvedFinalizeErrors(errors, undefined);

    // Assert
    expect(result).toEqual(errors);
  });
});
