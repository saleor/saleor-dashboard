import {
  AddressFragment,
  InvoiceFragment,
  MarkAsPaidStrategyEnum,
  OrderChargeStatusEnum,
  OrderDetailsFragment,
  OrderStatus,
  PaymentChargeStatusEnum,
} from "@dashboard/graphql";
import merge from "lodash/merge";

/**
 * Builder for creating `OrderDetailsFragment` fixtures
 *
 * @example
 * const order = OrderFixture.fulfilled().withInvoices([invoice]).build();
 */
export class OrderFixture {
  private static baseOrder = {
    __typename: "Order",
    number: "12345",
    created: "2023-10-01T12:00:00Z",
    isShippingRequired: true,
    canFinalize: false,
    customerNote: "",
    isPaid: true,
    paymentStatus: PaymentChargeStatusEnum.FULLY_CHARGED,
    shippingMethodName: "Standard Shipping",
    collectionPointName: null,
    actions: [],
    userEmail: "customer@example.com",
    chargeStatus: OrderChargeStatusEnum.FULL,
    transactions: [],
    payments: [],
    giftCards: [],
    grantedRefunds: [],
    discounts: [],
    events: [],
    fulfillments: [],
    lines: [],
    deliveryMethod: null,
    shippingMethod: null,
    shippingPrice: {
      __typename: "TaxedMoney",
      gross: {
        __typename: "Money",
        amount: 10,
        currency: "USD",
      },
    },
    subtotal: {
      __typename: "TaxedMoney",
      gross: {
        __typename: "Money",
        amount: 100,
        currency: "USD",
      },
      net: {
        __typename: "Money",
        amount: 100,
        currency: "USD",
      },
    },
    total: {
      __typename: "TaxedMoney",
      gross: {
        __typename: "Money",
        amount: 110,
        currency: "USD",
      },
      net: {
        __typename: "Money",
        amount: 110,
        currency: "USD",
      },
      tax: {
        __typename: "Money",
        amount: 0,
        currency: "USD",
      },
    },
    totalRemainingGrant: {
      __typename: "Money",
      amount: 0,
      currency: "USD",
    },
    totalGrantedRefund: {
      __typename: "Money",
      amount: 0,
      currency: "USD",
    },
    totalRefundPending: {
      __typename: "Money",
      amount: 0,
      currency: "USD",
    },
    totalRefunded: {
      __typename: "Money",
      amount: 0,
      currency: "USD",
    },
    totalAuthorizePending: {
      __typename: "Money",
      amount: 0,
      currency: "USD",
    },
    totalAuthorized: {
      __typename: "Money",
      amount: 0,
      currency: "USD",
    },
    totalCaptured: {
      __typename: "Money",
      amount: 110,
      currency: "USD",
    },
    totalCharged: {
      __typename: "Money",
      amount: 110,
      currency: "USD",
    },
    totalChargePending: {
      __typename: "Money",
      amount: 0,
      currency: "USD",
    },
    totalCanceled: {
      __typename: "Money",
      amount: 0,
      currency: "USD",
    },
    totalCancelPending: {
      __typename: "Money",
      amount: 0,
      currency: "USD",
    },
    totalBalance: {
      __typename: "Money",
      amount: 0,
      currency: "USD",
    },
    undiscountedTotal: {
      __typename: "TaxedMoney",
      net: {
        __typename: "Money",
        amount: 110,
        currency: "USD",
      },
      gross: {
        __typename: "Money",
        amount: 110,
        currency: "USD",
      },
    },
    user: {
      __typename: "User",
      id: "user-id",
      email: "customer@example.com",
    },
    shippingMethods: [],
    invoices: [],
    metadata: [],
    privateMetadata: [],
  } satisfies Partial<OrderDetailsFragment>;

  private static address = {
    phone: "mocked-phone-number",
    cityArea: "",
    countryArea: "",
    __typename: "Address",
    city: "Wroclaw",
    id: "shipping-address-id",
    companyName: "Saleor",
    firstName: "Test",
    lastName: "Testowy",
    streetAddress1: "Teczowa 7",
    streetAddress2: "",
    postalCode: "53-000",
    country: {
      __typename: "CountryDisplay",
      code: "PL",
      country: "Poland",
    },
  } satisfies AddressFragment;

  private static channel = {
    __typename: "Channel",
    id: "channel-id",
    name: "Default Channel",
    isActive: true,
    currencyCode: "USD",
    slug: "default-channel",
    defaultCountry: {
      __typename: "CountryDisplay",
      code: "US",
    },
    orderSettings: {
      __typename: "OrderSettings",
      markAsPaidStrategy: MarkAsPaidStrategyEnum.TRANSACTION_FLOW,
    },
  } satisfies OrderDetailsFragment["channel"];

  private order: OrderDetailsFragment;

  private constructor(initialOrder: OrderDetailsFragment) {
    this.order = { ...initialOrder };
  }

  /**
   * Creates a fulfilled order fixture
   */
  static fulfilled(): OrderFixture {
    const fulfilledOrder: OrderDetailsFragment = merge(OrderFixture.baseOrder, {
      id: "fulfilled-order-id",
      status: OrderStatus.FULFILLED,
      billingAddress: OrderFixture.address,
      shippingAddress: OrderFixture.address,
      channel: OrderFixture.channel,
    });

    return new OrderFixture(fulfilledOrder);
  }

  /**
   * Creates an unconfirmed order fixture
   */
  static unconfirmed(): OrderFixture {
    const unconfirmedOrder: OrderDetailsFragment = merge(OrderFixture.baseOrder, {
      id: "unconfirmed-order-id",
      status: OrderStatus.UNCONFIRMED,
      fulfillments: [],
      billingAddress: OrderFixture.address,
      shippingAddress: OrderFixture.address,
      channel: OrderFixture.channel,
    });

    return new OrderFixture(unconfirmedOrder);
  }

  /**
   * Sets the order invoices
   */
  withInvoices(invoices: InvoiceFragment[]): OrderFixture {
    this.order = {
      ...this.order,
      invoices,
    };

    return this;
  }

  withCustomerNote(note: string): OrderFixture {
    this.order = {
      ...this.order,
      customerNote: note,
    };

    return this;
  }

  withBillingAddress(address: OrderDetailsFragment["billingAddress"]): OrderFixture {
    this.order = {
      ...this.order,
      billingAddress: address,
    };

    return this;
  }

  withShippingAddress(address: OrderDetailsFragment["shippingAddress"]): OrderFixture {
    this.order = {
      ...this.order,
      shippingAddress: address,
    };

    return this;
  }

  withChannel(channel: OrderDetailsFragment["channel"]): OrderFixture {
    this.order = {
      ...this.order,
      channel,
    };

    return this;
  }

  /**
   * Builds and returns the final OrderDetailsFragment
   */
  build(): OrderDetailsFragment {
    return { ...this.order };
  }
}
