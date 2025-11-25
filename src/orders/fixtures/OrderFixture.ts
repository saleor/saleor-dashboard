import {
  AddressFragment,
  DiscountValueTypeEnum,
  FulfillmentFragment,
  FulfillmentStatus,
  GiftCardEventsEnum,
  InvoiceFragment,
  MarkAsPaidStrategyEnum,
  OrderAuthorizeStatusEnum,
  OrderChargeStatusEnum,
  OrderDetailsFragment,
  OrderGrantedRefundStatusEnum,
  OrderStatus,
  PaymentChargeStatusEnum,
  TransactionEventTypeEnum,
} from "@dashboard/graphql";
import cloneDeep from "lodash/cloneDeep";
import merge from "lodash/merge";

/**
 * Builder for creating `OrderDetailsFragment` fixtures
 *
 * @example
 * const order = OrderFixture.fulfilled().withInvoices([invoice]).build();
 */
export class OrderFixture {
  private static baseOrder = {
    displayGrossPrices: true,
    __typename: "Order",
    number: "12345",
    created: "2023-10-01T12:00:00Z",
    isShippingRequired: true,
    canFinalize: false,
    customerNote: "",
    isPaid: true,
    paymentStatus: PaymentChargeStatusEnum.FULLY_CHARGED,
    shippingMethodName: "DB Schenker",
    collectionPointName: null,
    actions: [],
    userEmail: "customer@example.com",
    chargeStatus: OrderChargeStatusEnum.FULL,
    authorizeStatus: OrderAuthorizeStatusEnum.NONE,
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
        amount: 100.33,
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

  private static lines = [
    {
      __typename: "OrderLine",
      isShippingRequired: true,
      productName: "Test Product",
      unitDiscountValue: 0,
      productSku: "TEST-PRODUCT-SKU",
      quantityFulfilled: 2,
      quantityToFulfill: 0,
      unitDiscountReason: null,
      unitDiscountType: null,
      allocations: [],
      unitDiscount: {
        __typename: "Money",
        amount: 0,
        currency: "USD",
      },
      thumbnail: {
        __typename: "Image",
        url: "https://example.com/image.jpg",
      },
      unitPrice: {
        __typename: "TaxedMoney",
        gross: {
          __typename: "Money",
          amount: 50,
          currency: "USD",
        },
        net: {
          __typename: "Money",
          amount: 50,
          currency: "USD",
        },
      },
      undiscountedUnitPrice: {
        __typename: "TaxedMoney",
        currency: "USD",
        gross: {
          __typename: "Money",
          amount: 50,
          currency: "USD",
        },
        net: {
          __typename: "Money",
          amount: 50,
          currency: "USD",
        },
      },
      variant: {
        __typename: "ProductVariant",
        id: "variant-id-1",
        name: "Test Variant",
        quantityAvailable: 100,
        preorder: {
          __typename: "PreorderData",
          endDate: null,
        },
        stocks: [
          {
            __typename: "Stock",
            id: "stock-id-1",
            quantity: 100,
            warehouse: {
              __typename: "Warehouse",
              id: "warehouse-id-1",
              name: "Main Warehouse",
            },
            quantityAllocated: 0,
          },
        ],
        product: {
          __typename: "Product",
          id: "product-id-1",
          isAvailableForPurchase: true,
        },
      },
      isGift: false,
      id: "line-id-1",
      quantity: 2,
      totalPrice: {
        __typename: "TaxedMoney",
        gross: {
          __typename: "Money",
          amount: 50,
          currency: "USD",
        },
        net: {
          __typename: "Money",
          amount: 50,
          currency: "USD",
        },
      },
    },
  ] satisfies OrderDetailsFragment["lines"];

  private static baseFulfillment = {
    __typename: "Fulfillment",
    id: "fulfillment-id-1",
    status: FulfillmentStatus.FULFILLED,
    fulfillmentOrder: 1,
    trackingNumber: "1234",
    created: "2023-10-01T12:00:00Z",
    lines: [
      {
        __typename: "FulfillmentLine",
        id: "",
        quantity: 0,
        orderLine: {
          __typename: "OrderLine",
          id: "",
          isShippingRequired: false,
          productName: "",
          productSku: "",
          isGift: false,
          quantity: 0,
          quantityFulfilled: 0,
          quantityToFulfill: 0,
          unitDiscountValue: undefined,
          unitDiscountReason: "",
          unitDiscountType: DiscountValueTypeEnum.FIXED,
          allocations: [],
          variant: {
            __typename: "ProductVariant",
            id: "",
            name: "",
            quantityAvailable: 0,
            preorder: {
              __typename: "PreorderData",
              endDate: undefined,
            },
            stocks: [],
            product: {
              __typename: "Product",
              id: "",
              isAvailableForPurchase: false,
            },
          },
          totalPrice: {
            __typename: "TaxedMoney",
            net: {
              __typename: "Money",
              amount: 0,
              currency: "",
            },
            gross: {
              __typename: "Money",
              amount: 0,
              currency: "",
            },
          },
          unitDiscount: {
            __typename: "Money",
            amount: 0,
            currency: "",
          },
          undiscountedUnitPrice: {
            __typename: "TaxedMoney",
            currency: "",
            gross: {
              __typename: "Money",
              amount: 0,
              currency: "",
            },
            net: {
              __typename: "Money",
              amount: 0,
              currency: "",
            },
          },
          unitPrice: {
            __typename: "TaxedMoney",
            gross: {
              __typename: "Money",
              amount: 0,
              currency: "",
            },
            net: {
              __typename: "Money",
              amount: 0,
              currency: "",
            },
          },
          thumbnail: {
            __typename: "Image",
            url: "",
          },
        },
      },
    ],
    warehouse: {
      __typename: "Warehouse",
      id: "warehouse-id-1",
      name: "Americas",
    },
    metadata: [],
    privateMetadata: [],
  } satisfies FulfillmentFragment;

  private static giftCards = [
    {
      __typename: "GiftCard",
      id: "gift-card-id-1",
      last4CodeChars: "4321",
      events: [
        {
          type: GiftCardEventsEnum.USED_IN_ORDER,
          __typename: "GiftCardEvent",
          id: "",
          orderId: "",
          date: undefined,
          balance: {
            __typename: "GiftCardEventBalance",
            initialBalance: {
              __typename: "Money",
              amount: 0,
              currency: "USD",
            },
            currentBalance: {
              __typename: "Money",
              amount: 234.33,
              currency: "USD",
            },
            oldInitialBalance: {
              __typename: "Money",
              amount: 0,
              currency: "USD",
            },
            oldCurrentBalance: {
              __typename: "Money",
              amount: 500,
              currency: "USD",
            },
          },
        },
      ],
    },
    {
      __typename: "GiftCard",
      id: "gift-card-id-1",
      last4CodeChars: "2345",
      events: [
        {
          type: GiftCardEventsEnum.USED_IN_ORDER,
          __typename: "GiftCardEvent",
          id: "",
          orderId: "",
          date: undefined,
          balance: {
            __typename: "GiftCardEventBalance",
            initialBalance: {
              __typename: "Money",
              amount: 0,
              currency: "USD",
            },
            currentBalance: {
              __typename: "Money",
              amount: 234.33,
              currency: "USD",
            },
            oldInitialBalance: {
              __typename: "Money",
              amount: 0,
              currency: "USD",
            },
            oldCurrentBalance: {
              __typename: "Money",
              amount: 500,
              currency: "USD",
            },
          },
        },
      ],
    },
  ] satisfies OrderDetailsFragment["giftCards"];

  private static transaction = {
    __typename: "TransactionItem" as const,
    id: "transaction-id",
    pspReference: "psp-ref",
    externalUrl: "https://example.com/transaction",
    createdAt: "2023-01-01T12:00:00Z",
    name: "Transaction",
    events: [],
    actions: [],
    authorizedAmount: {
      __typename: "Money" as const,
      amount: 100,
      currency: "USD",
    },
    chargedAmount: {
      __typename: "Money" as const,
      amount: 100,
      currency: "USD",
    },
    refundedAmount: {
      __typename: "Money" as const,
      amount: 0,
      currency: "USD",
    },
    canceledAmount: {
      __typename: "Money" as const,
      amount: 0,
      currency: "USD",
    },
    authorizePendingAmount: {
      __typename: "Money" as const,
      amount: 0,
      currency: "USD",
    },
    chargePendingAmount: {
      __typename: "Money" as const,
      amount: 0,
      currency: "USD",
    },
    refundPendingAmount: {
      __typename: "Money" as const,
      amount: 0,
      currency: "USD",
    },
    cancelPendingAmount: {
      __typename: "Money" as const,
      amount: 0,
      currency: "USD",
    },
  } satisfies OrderDetailsFragment["transactions"][number];

  private order: OrderDetailsFragment;

  private constructor(initialOrder: OrderDetailsFragment) {
    this.order = { ...initialOrder };
  }

  static fulfilled(): OrderFixture {
    const fulfilledOrder: OrderDetailsFragment = merge(cloneDeep(OrderFixture.baseOrder), {
      id: "fulfilled-order-id",
      status: OrderStatus.FULFILLED,
      billingAddress: OrderFixture.address,
      shippingAddress: OrderFixture.address,
      channel: OrderFixture.channel,
      lines: OrderFixture.lines,
      fulfillments: [OrderFixture.baseFulfillment],
    });

    return new OrderFixture(fulfilledOrder);
  }

  static unconfirmed(): OrderFixture {
    const unconfirmedOrder: OrderDetailsFragment = merge(cloneDeep(OrderFixture.baseOrder), {
      id: "unconfirmed-order-id",
      status: OrderStatus.UNCONFIRMED,
      isPaid: false,
      paymentStatus: PaymentChargeStatusEnum.NOT_CHARGED,
      chargeStatus: OrderChargeStatusEnum.NONE,
      fulfillments: [],
      billingAddress: OrderFixture.address,
      shippingAddress: OrderFixture.address,
      channel: OrderFixture.channel,
      lines: OrderFixture.lines,
      totalCaptured: {
        __typename: "Money",
        amount: 0,
        currency: "USD",
      },
      totalCharged: {
        __typename: "Money",
        amount: 0,
        currency: "USD",
      },
    });

    return new OrderFixture(unconfirmedOrder);
  }

  static unfulfilled(): OrderFixture {
    const unfulfilledOrder: OrderDetailsFragment = merge(cloneDeep(OrderFixture.baseOrder), {
      id: "unfulfilled-order-id",
      status: OrderStatus.UNFULFILLED,
      billingAddress: OrderFixture.address,
      shippingAddress: OrderFixture.address,
      channel: OrderFixture.channel,
      lines: OrderFixture.lines,
      fulfillments: [],
    });

    return new OrderFixture(unfulfilledOrder);
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

  withReturnedFulfillment(): OrderFixture {
    const returnedFulfillment: FulfillmentFragment = {
      ...OrderFixture.baseFulfillment,
      status: FulfillmentStatus.RETURNED,
    };

    this.order = {
      ...this.order,
      fulfillments: [...this.order.fulfillments, returnedFulfillment],
    };

    return this;
  }

  withReplacedFulfillment(): OrderFixture {
    const replacedFulfillment: FulfillmentFragment = {
      ...OrderFixture.baseFulfillment,
      status: FulfillmentStatus.REPLACED,
    };

    this.order = {
      ...this.order,
      fulfillments: [...this.order.fulfillments, replacedFulfillment],
    };

    return this;
  }

  withRefundedFulfillment(): OrderFixture {
    const refundedFulfillment: FulfillmentFragment = {
      ...OrderFixture.baseFulfillment,
      status: FulfillmentStatus.REFUNDED,
    };

    this.order = {
      ...this.order,
      fulfillments: [...this.order.fulfillments, refundedFulfillment],
    };

    return this;
  }

  withCanceledFulfillment(): OrderFixture {
    const canceledFulfillment: FulfillmentFragment = {
      ...OrderFixture.baseFulfillment,
      status: FulfillmentStatus.CANCELED,
    };

    this.order = {
      ...this.order,
      fulfillments: [...this.order.fulfillments, canceledFulfillment],
    };

    return this;
  }

  withWaitingForApprovalFulfillment(): OrderFixture {
    const waitingForApprovalFulfillment: FulfillmentFragment = {
      ...OrderFixture.baseFulfillment,
      status: FulfillmentStatus.WAITING_FOR_APPROVAL,
    };

    this.order = {
      ...this.order,
      fulfillments: [...this.order.fulfillments, waitingForApprovalFulfillment],
    };

    return this;
  }

  withRefundedAndReturnedFulfillment(): OrderFixture {
    const refundedAndReturnedFulfillment: FulfillmentFragment = {
      ...OrderFixture.baseFulfillment,
      status: FulfillmentStatus.REFUNDED_AND_RETURNED,
    };

    this.order = {
      ...this.order,
      fulfillments: [...this.order.fulfillments, refundedAndReturnedFulfillment],
    };

    return this;
  }

  withGiftCards(): OrderFixture {
    const giftCardsWithOrderId = OrderFixture.giftCards.map(giftCard => ({
      ...giftCard,
      events: giftCard.events.map(event => ({
        ...event,
        orderId: this.order.id,
      })),
    }));

    this.order = {
      ...this.order,
      giftCards: giftCardsWithOrderId,
    };

    return this;
  }

  withManualRefund(
    refundStatus: TransactionEventTypeEnum = TransactionEventTypeEnum.REFUND_SUCCESS,
  ): OrderFixture {
    this.order = {
      ...this.order,
      transactions: [
        {
          ...OrderFixture.transaction,
          pspReference: "manual-refund-psp-ref",
          events: [
            {
              id: "event-id-1",
              __typename: "TransactionEvent",
              amount: {
                amount: 1,
                currency: "USD",
                __typename: "Money",
              },
              externalUrl: "https://example.com/transaction",
              createdAt: "2025-09-12T08:57:38.515000+00:00",
              reasonReference: null,
              createdBy: {
                id: "created-by-app",
                name: "Dummy Payment App",
                __typename: "App",
                brand: null,
              },
              pspReference: "manual-refund-psp-ref",
              type: refundStatus,
              message: "Great success!",
            },
            {
              id: "event-id-2",
              __typename: "TransactionEvent",
              amount: {
                amount: 50,
                currency: "USD",
                __typename: "Money",
              },
              externalUrl: "https://example.com/transaction",
              createdAt: "2025-09-12T08:26:37.572285+00:00",
              reasonReference: null,
              createdBy: {
                id: "VXNlcjox",
                email: "test@saleor.io",
                isActive: true,
                firstName: "First Name",
                lastName: "Last Name",
                avatar: null,
                __typename: "User",
              },
              pspReference: "manual-refund-psp-ref",
              type: TransactionEventTypeEnum.REFUND_REQUEST,
              message: "Manual refund processed successfully.",
            },
          ],
        },
      ],
    };

    return this;
  }

  withTransaction() {
    this.order = {
      ...this.order,
      transactions: [OrderFixture.transaction],
    };

    return this;
  }

  withGrantedRefund(): OrderFixture {
    this.order = {
      ...this.order,
      grantedRefunds: [
        {
          __typename: "OrderGrantedRefund",
          id: "granted-refund-id-1",
          status: OrderGrantedRefundStatusEnum.SUCCESS,
          amount: {
            __typename: "Money",
            amount: 10,
            currency: "USD",
          },
          reason: "Customer requested a refund.",
          createdAt: "2023-10-02T12:00:00Z",
          reasonReference: null,
          user: {
            __typename: "User",
            email: "customer@example.com",
            firstName: "Test",
            lastName: "Testowy",
            id: "user-id",
            avatar: {
              __typename: "Image",
              url: "https://example.com/avatar.jpg",
              alt: "Customer avatar",
            },
          },
          shippingCostsIncluded: false,
          transactionEvents: [],
          app: {
            __typename: "App",
            id: "",
            name: "",
            brand: null,
          },
          lines: [],
        },
      ],
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
