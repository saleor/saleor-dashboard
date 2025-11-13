import {
  OrderGrantedRefundFragment,
  OrderGrantedRefundStatusEnum,
  TransactionActionEnum,
  TransactionEventFragment,
  TransactionEventTypeEnum,
} from "@dashboard/graphql";
import { OrderFixture } from "@dashboard/orders/fixtures/OrderFixture";

import { OrderRefundDisplay, OrderRefundsViewModel } from "./OrderRefundsViewModel";

const createTransactionEvent = (
  overrides: Partial<TransactionEventFragment> = {},
): TransactionEventFragment => {
  return {
    __typename: "TransactionEvent",
    id: "event-1",
    pspReference: "psp-ref-1",
    type: TransactionEventTypeEnum.REFUND_SUCCESS,
    amount: {
      __typename: "Money",
      amount: 100,
      currency: "USD",
    },
    createdAt: "2023-01-01T10:00:00Z",
    createdBy: {
      __typename: "User",
      id: "user-1",
      email: "user@example.com",
      firstName: "John",
      lastName: "Doe",
      isActive: true,
      avatar: {
        __typename: "Image",
        url: "https://example.com/avatar.jpg",
      },
    },
    message: "",
    externalUrl: "",
    reasonReference: null,
    ...overrides,
  };
};

const createGrantedRefund = (
  overrides: Partial<OrderGrantedRefundFragment & { type: "standard" | "manual" }> = {},
): OrderGrantedRefundFragment & { type: "standard" | "manual" } => {
  return {
    __typename: "OrderGrantedRefund",
    id: "granted-1",
    amount: {
      __typename: "Money",
      amount: 50,
      currency: "USD",
    },
    reason: "Customer return",
    createdAt: "2023-01-02T10:00:00Z",
    status: OrderGrantedRefundStatusEnum.SUCCESS,
    user: {
      __typename: "User",
      id: "user-2",
      email: "staff@example.com",
      firstName: "Jane",
      lastName: "Smith",
      avatar: {
        __typename: "Image",
        url: "https://example.com/avatar2.jpg",
        alt: "Jane Smith avatar",
      },
    },
    app: null,
    shippingCostsIncluded: false,
    lines: [],
    transactionEvents: null,
    type: "standard" as const,
    reasonReference: null,
    ...overrides,
  };
};

const createOrderRefundDisplay = (overrides: Partial<OrderRefundDisplay>): OrderRefundDisplay => {
  return {
    reasonType: null,
    createdAt: "2023-01-02T10:00:00Z",
    status: OrderGrantedRefundStatusEnum.SUCCESS,
    type: "manual",
    id: "refund-1",
    reasonNote: null,
    user: {
      email: "staff@example.com",
      firstName: "Jane",
      lastName: "Smith",
    },
    amount: {
      amount: 100,
      currency: "USD",
    },
    creator: null,
    ...overrides,
  };
};

describe("OrderRefundsViewModel", () => {
  const mockTransactionEvent = createTransactionEvent({
    id: "event-1",
    pspReference: "psp-ref-1",
    type: TransactionEventTypeEnum.REFUND_SUCCESS,
    amount: {
      __typename: "Money",
      amount: 100,
      currency: "USD",
    },
    createdAt: "2023-01-01T10:00:00Z",
    createdBy: {
      __typename: "User",
      id: "user-1",
      email: "user@example.com",
      firstName: "John",
      lastName: "Doe",
      isActive: true,
      avatar: {
        __typename: "Image",
        url: "https://example.com/avatar.jpg",
      },
    },
  });

  const mockGrantedRefund = createGrantedRefund({
    id: "granted-1",
    amount: {
      __typename: "Money",
      amount: 50,
      currency: "USD",
    },
    reason: "Customer return",
    createdAt: "2023-01-02T10:00:00Z",
    status: OrderGrantedRefundStatusEnum.SUCCESS,
    user: {
      __typename: "User",
      id: "user-2",
      email: "staff@example.com",
      firstName: "Jane",
      lastName: "Smith",
      avatar: {
        __typename: "Image",
        url: "https://example.com/avatar2.jpg",
        alt: "Jane Smith avatar",
      },
    },
  });

  describe("prepareOrderRefundDisplayList", () => {
    it("should return empty array when no data provided", () => {
      // Arrange
      const transactionEvents: TransactionEventFragment[] = [];
      const grantedRefunds: OrderGrantedRefundFragment[] = [];

      // Act
      const result = OrderRefundsViewModel.prepareOrderRefundDisplayList(
        transactionEvents,
        grantedRefunds,
      );

      // Assert
      expect(result).toEqual([]);
    });

    it("should convert granted refunds to order refund display format", () => {
      // Arrange
      const transactionEvents: TransactionEventFragment[] = [];
      const grantedRefunds = [mockGrantedRefund];

      // Act
      const result = OrderRefundsViewModel.prepareOrderRefundDisplayList(
        transactionEvents,
        grantedRefunds,
      );

      // Assert
      expect(result).toStrictEqual([
        expect.objectContaining({
          id: "granted-1",
          type: "standard",
          status: OrderGrantedRefundStatusEnum.SUCCESS,
          amount: {
            __typename: "Money",
            amount: 50,
            currency: "USD",
          },
          reason: "Customer return",
          createdAt: "2023-01-02T10:00:00Z",
        }),
      ]);
    });

    it("should convert manual refunds from transaction events", () => {
      // Arrange
      const transactionEvents = [mockTransactionEvent];
      const grantedRefunds: OrderGrantedRefundFragment[] = [];

      // Act
      const result = OrderRefundsViewModel.prepareOrderRefundDisplayList(
        transactionEvents,
        grantedRefunds,
      );

      // Assert
      expect(result).toStrictEqual([
        expect.objectContaining({
          id: "event-1",
          type: "manual",
          status: OrderGrantedRefundStatusEnum.SUCCESS,
          amount: expect.objectContaining({
            amount: 100,
            currency: "USD",
          }),
          reasonNote: null,
          reasonType: null,
          createdAt: "2023-01-01T10:00:00Z",
          user: expect.objectContaining({
            email: "user@example.com",
            firstName: "John",
            lastName: "Doe",
          }),
        }),
      ]);
    });

    it("should exclude transaction events that are associated with granted refunds", () => {
      // Arrange
      const transactionEventAssociated = createTransactionEvent({
        id: "event-associated",
      });
      const grantedRefundWithEvent = createGrantedRefund({
        transactionEvents: [{ __typename: "TransactionEvent", id: "event-associated" }],
      });

      // Act
      const result = OrderRefundsViewModel.prepareOrderRefundDisplayList(
        [mockTransactionEvent, transactionEventAssociated],
        [grantedRefundWithEvent],
      );

      // Assert
      expect(result).toStrictEqual([
        expect.objectContaining({
          id: "granted-1",
          type: "standard",
        }),
        expect.objectContaining({
          id: "event-1",
          type: "manual",
          status: OrderGrantedRefundStatusEnum.SUCCESS,
        }),
      ]);
    });

    it("should sort results by creation date descending", () => {
      // Arrange
      const olderEvent = createTransactionEvent({
        id: "older-event",
        pspReference: "psp-ref-2",
        createdAt: "2023-01-01T09:00:00Z",
      });
      const newerRefund = createGrantedRefund({
        id: "newer-refund",
        createdAt: "2023-01-01T11:00:00Z",
      });

      // Act
      const result = OrderRefundsViewModel.prepareOrderRefundDisplayList(
        [olderEvent, mockTransactionEvent],
        [newerRefund],
      );

      // Assert
      expect(result).toStrictEqual([
        expect.objectContaining({
          id: "newer-refund",
          type: "standard",
          createdAt: "2023-01-01T11:00:00Z",
        }),
        expect.objectContaining({
          id: "event-1",
          type: "manual",
          createdAt: "2023-01-01T10:00:00Z",
        }),
        expect.objectContaining({
          id: "older-event",
          type: "manual",
          createdAt: "2023-01-01T09:00:00Z",
        }),
      ]);
    });

    it("should filter only supported transaction event types", () => {
      // Arrange
      const unsupportedEvent = createTransactionEvent({
        id: "unsupported",
        type: TransactionEventTypeEnum.AUTHORIZATION_SUCCESS,
      });
      const supportedEvents = [
        createTransactionEvent({
          id: "success",
          pspReference: "psp-success",
          type: TransactionEventTypeEnum.REFUND_SUCCESS,
        }),
        createTransactionEvent({
          id: "failure",
          pspReference: "psp-failure",
          type: TransactionEventTypeEnum.REFUND_FAILURE,
        }),
        createTransactionEvent({
          id: "request",
          pspReference: "psp-request",
          type: TransactionEventTypeEnum.REFUND_REQUEST,
        }),
      ];

      // Act
      const result = OrderRefundsViewModel.prepareOrderRefundDisplayList(
        [unsupportedEvent, ...supportedEvents],
        [],
      );

      // Assert
      expect(result).toHaveLength(3);
      expect(result.find(r => r.id === "unsupported")).toBeUndefined();
    });

    it("Should properly map reasonReference to reasonType in OrderRefundDisplay", () => {
      // Only requests have reasons
      const manualEvents = [
        createTransactionEvent({
          id: "request-1",
          pspReference: "psp-request-1",
          type: TransactionEventTypeEnum.REFUND_REQUEST,
          reasonReference: null,
          message: "Reason manual note without type",
        }),
        createTransactionEvent({
          id: "request-2",
          pspReference: "psp-request-2",
          type: TransactionEventTypeEnum.REFUND_REQUEST,
          reasonReference: { __typename: "Page", id: "ref-1", title: "Broken in shipping" },
          message: "Reason manual note with type",
        }),
        createTransactionEvent({
          id: "request-3",
          pspReference: "psp-request-3",
          type: TransactionEventTypeEnum.REFUND_REQUEST,
          reasonReference: {
            __typename: "Page",
            id: "ref-1",
            title: "Broken in shipping (no message)",
          },
          message: "",
        }),
      ];
      const grantedRefunds = [
        createGrantedRefund({
          reason: "Reason without type [grant]",
        }),
        createGrantedRefund({
          reason: "Reason with type [grant]",
          reasonReference: {
            __typename: "Page",
            id: "ref-1",
            title: "Broken in shipping",
          },
        }),
        createGrantedRefund({
          reason: null,
          reasonReference: {
            __typename: "Page",
            id: "ref-1",
            title: "Broken in shipping (no note) [grant]",
          },
        }),
      ];

      const results = OrderRefundsViewModel.prepareOrderRefundDisplayList(
        manualEvents,
        grantedRefunds,
      );

      // For brevity, check only fields related to reason mapping
      const onlyReasons = results.map(r => ({
        reasonType: r.reasonType,
        reasonNote: r.reasonNote,
      }));

      expect(onlyReasons).toMatchInlineSnapshot(`
Array [
  Object {
    "reasonNote": "Reason without type [grant]",
    "reasonType": null,
  },
  Object {
    "reasonNote": "Reason with type [grant]",
    "reasonType": "Broken in shipping",
  },
  Object {
    "reasonNote": null,
    "reasonType": "Broken in shipping (no note) [grant]",
  },
  Object {
    "reasonNote": "Reason manual note without type",
    "reasonType": null,
  },
  Object {
    "reasonNote": "Reason manual note with type",
    "reasonType": "Broken in shipping",
  },
  Object {
    "reasonNote": "",
    "reasonType": "Broken in shipping (no message)",
  },
]
`);
    });
  });

  describe("mapEventToRefundStatus", () => {
    it.each([
      [TransactionEventTypeEnum.REFUND_SUCCESS, OrderGrantedRefundStatusEnum.SUCCESS],
      [TransactionEventTypeEnum.REFUND_FAILURE, OrderGrantedRefundStatusEnum.FAILURE],
      [TransactionEventTypeEnum.REFUND_REQUEST, OrderGrantedRefundStatusEnum.PENDING],
      [TransactionEventTypeEnum.AUTHORIZATION_SUCCESS, OrderGrantedRefundStatusEnum.NONE],
    ])("should map %s to %s status", (eventType, expectedStatus) => {
      // Arrange
      const event = createTransactionEvent({ type: eventType });

      // Act
      const result = OrderRefundsViewModel["mapEventToRefundStatus"](event);

      // Assert
      expect(result).toBe(expectedStatus);
    });
  });

  describe("determineCreatorDisplay", () => {
    const userCreator = createTransactionEvent().createdBy;

    const appCreator = {
      __typename: "App" as const,
      id: "app-1",
      name: "Test App",
      brand: null,
    };

    it.each([
      [
        "User creator",
        userCreator,
        {
          email: "user@example.com",
          firstName: "John",
          lastName: "Doe",
        },
      ],
      ["App creator", appCreator, null],
      ["null creator", null, null],
    ])("should handle %s correctly", (_, creator, expected) => {
      // Act
      const result = OrderRefundsViewModel["determineCreatorDisplay"](creator);

      // Assert
      expect(result).toStrictEqual(expected);
    });
  });

  describe("getCreator", () => {
    it("should return app creator with initials and logo", () => {
      // Arrange
      const appCreator = {
        __typename: "App" as const,
        id: "app-1",
        name: "Payment App",
        brand: {
          __typename: "AppBrand" as const,
          logo: {
            __typename: "AppBrandLogo" as const,
            default: "https://example.com/app-logo.webp",
          },
        },
      };

      // Act
      const result = OrderRefundsViewModel["getCreator"](appCreator);

      // Assert
      expect(result).toStrictEqual({
        initials: "PA",
        logoUrl: "https://example.com/app-logo.webp",
      });
    });

    it("should return app creator with initials when logo is missing", () => {
      // Arrange
      const appCreator = {
        __typename: "App" as const,
        id: "app-2",
        name: "Another App",
        brand: null,
      };

      // Act
      const result = OrderRefundsViewModel["getCreator"](appCreator);

      // Assert
      expect(result).toStrictEqual({
        initials: "AN",
        logoUrl: null,
      });
    });

    it("should return app creator with empty initials when name is null", () => {
      // Arrange
      const appCreator = {
        __typename: "App" as const,
        id: "app-3",
        name: null,
        brand: null,
      };

      // Act
      const result = OrderRefundsViewModel["getCreator"](appCreator);

      // Assert
      expect(result).toStrictEqual({
        initials: "",
        logoUrl: null,
      });
    });

    it("should return app creator with initials and handle nested null logo", () => {
      // Arrange
      const appCreator = {
        __typename: "App" as const,
        id: "app-4",
        name: "Test App",
        brand: {
          __typename: "AppBrand" as const,
          logo: {
            __typename: "AppBrandLogo" as const,
            default: null as any,
          },
        },
      };

      // Act
      const result = OrderRefundsViewModel["getCreator"](appCreator);

      // Assert
      expect(result).toStrictEqual({
        initials: "TE",
        logoUrl: null,
      });
    });

    it("should return user creator with initials and avatar", () => {
      // Arrange
      const userCreator = {
        __typename: "User" as const,
        id: "user-1",
        email: "john.doe@example.com",
        firstName: "John",
        lastName: "Doe",
        isActive: true,
        avatar: {
          __typename: "Image" as const,
          url: "https://example.com/user-avatar.jpg",
        },
      };

      // Act
      const result = OrderRefundsViewModel["getCreator"](userCreator);

      // Assert
      expect(result).toStrictEqual({
        initials: "JD",
        logoUrl: "https://example.com/user-avatar.jpg",
      });
    });

    it("should return user creator with initials when avatar is missing", () => {
      // Arrange
      const userCreator = {
        __typename: "User" as const,
        id: "user-2",
        email: "jane.smith@example.com",
        firstName: "Jane",
        lastName: "Smith",
        isActive: true,
        avatar: null,
      };

      // Act
      const result = OrderRefundsViewModel["getCreator"](userCreator);

      // Assert
      expect(result).toStrictEqual({
        initials: "JS",
        logoUrl: null,
      });
    });

    it("should handle user with empty name by using email for initials", () => {
      // Arrange
      const userCreator = {
        __typename: "User" as const,
        id: "user-3",
        email: "user@example.com",
        firstName: "",
        lastName: "",
        isActive: true,
        avatar: null,
      };

      // Act
      const result = OrderRefundsViewModel["getCreator"](userCreator);

      // Assert
      // getUserInitials falls back to email when name is empty, generating "US" from "user@example.com"
      expect(result).toStrictEqual({
        initials: "US",
        logoUrl: null,
      });
    });

    it("should handle null creator", () => {
      // Arrange
      const creator = null;

      // Act
      const result = OrderRefundsViewModel["getCreator"](creator);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe("groupEventsByPspReference", () => {
    it.each([
      [
        "events with different pspReferences",
        [
          createTransactionEvent({ id: "event-1", pspReference: "psp-1" }),
          createTransactionEvent({ id: "event-2", pspReference: "psp-2" }),
          createTransactionEvent({ id: "event-3", pspReference: "psp-1" }),
        ],
        {
          "psp-1": [
            createTransactionEvent({ id: "event-1", pspReference: "psp-1" }),
            createTransactionEvent({ id: "event-3", pspReference: "psp-1" }),
          ],
          "psp-2": [createTransactionEvent({ id: "event-2", pspReference: "psp-2" })],
        },
      ],
      ["empty events array", [], {}],
    ])("should handle %s", (_, events, expected) => {
      // Act
      const result = OrderRefundsViewModel["groupEventsByPspReference"](events);

      // Assert
      expect(result).toStrictEqual(expected);
    });
  });

  describe("findLatestEventWithUserAuthor", () => {
    const appEvent = createTransactionEvent({
      id: "app-event",
      createdBy: { __typename: "App" as const, id: "app-1", name: "Test App", brand: null },
    });

    const userEvent = createTransactionEvent({
      id: "user-event",
      createdBy: {
        __typename: "User" as const,
        id: "user-1",
        email: "user@example.com",
        firstName: "John",
        lastName: "Doe",
        isActive: true,
        avatar: {
          __typename: "Image" as const,
          url: "https://example.com/avatar.jpg",
        },
      },
    });

    it.each([
      ["events with User author", [appEvent, userEvent], userEvent],
      ["events without User author", [appEvent], null],
      ["empty events array", [], null],
    ])("should handle %s", (_, events, expected) => {
      // Act
      const result = OrderRefundsViewModel["findLatestEventWithUserAuthor"](events);

      // Assert
      expect(result).toStrictEqual(expected);
    });
  });

  describe("mapEventGroupsToOrderRefunds", () => {
    it("should map event groups to order refunds with latest event data", () => {
      // Arrange
      const olderEvent = createTransactionEvent({
        id: "older",
        createdAt: "2023-01-01T09:00:00Z",
        amount: { __typename: "Money" as const, amount: 50, currency: "USD" },
      });
      const newerEvent = createTransactionEvent({
        id: "newer",
        createdAt: "2023-01-01T10:00:00Z",
        amount: { __typename: "Money" as const, amount: 100, currency: "USD" },
      });
      const eventsByPspReference = {
        "psp-1": [olderEvent, newerEvent],
      };

      // Act
      const result =
        OrderRefundsViewModel["mapEventGroupsToOrderManualRefunds"](eventsByPspReference);

      // Assert
      expect(result).toStrictEqual([
        expect.objectContaining({
          id: "newer",
          type: "manual",
          status: OrderGrantedRefundStatusEnum.SUCCESS,
          reasonNote: null,
          reasonType: null,
          amount: expect.objectContaining({
            amount: 100,
            currency: "USD",
          }),
          createdAt: "2023-01-01T10:00:00Z",
          user: {
            email: "user@example.com",
            firstName: "John",
            lastName: "Doe",
          },
        }),
      ]);
    });

    it("should use latest event with user author for user information", () => {
      // Arrange
      const appEvent = createTransactionEvent({
        id: "app-event",
        createdAt: "2023-01-01T10:00:00Z",
        createdBy: { __typename: "App" as const, id: "app-1", name: "Test App", brand: null },
      });
      const userEvent = createTransactionEvent({
        id: "user-event",
        createdAt: "2023-01-01T09:00:00Z",
        createdBy: {
          __typename: "User" as const,
          id: "user-1",
          email: "user@example.com",
          firstName: "John",
          lastName: "Doe",
          isActive: true,
          avatar: {
            __typename: "Image" as const,
            url: "https://example.com/avatar.jpg",
          },
        },
      });
      const eventsByPspReference = {
        "psp-1": [appEvent, userEvent],
      };

      // Act
      const result =
        OrderRefundsViewModel["mapEventGroupsToOrderManualRefunds"](eventsByPspReference);

      // Assert
      expect(result[0]).toEqual(
        expect.objectContaining({
          user: expect.objectContaining({
            email: "user@example.com",
            firstName: "John",
            lastName: "Doe",
          }),
        }),
      );
    });
  });

  describe("canEditRefund", () => {
    it("should return true for editable refunds (not successful, not pending, not manual)", () => {
      // Arrange
      const editableRefund = createOrderRefundDisplay({
        status: OrderGrantedRefundStatusEnum.FAILURE,
        type: "standard",
      });

      // Act
      const result = OrderRefundsViewModel.canEditRefund(editableRefund);

      // Assert
      expect(result).toBe(true);
    });

    it("should return false for successful refunds", () => {
      // Arrange
      const successfulRefund = createOrderRefundDisplay({
        status: OrderGrantedRefundStatusEnum.SUCCESS,
        type: "standard",
      });

      // Act
      const result = OrderRefundsViewModel.canEditRefund(successfulRefund);

      // Assert
      expect(result).toBe(false);
    });

    it("should return false for pending refunds", () => {
      // Arrange
      const pendingRefund = createOrderRefundDisplay({
        status: OrderGrantedRefundStatusEnum.PENDING,
        type: "standard",
      });

      // Act
      const result = OrderRefundsViewModel.canEditRefund(pendingRefund);

      // Assert
      expect(result).toBe(false);
    });

    it("should return false for manual refunds", () => {
      // Arrange
      const manualRefund = createOrderRefundDisplay({
        id: "manual-1",
        type: "manual" as const,
        status: OrderGrantedRefundStatusEnum.FAILURE,
        amount: { amount: 50, currency: "USD" },
        createdAt: "2023-01-01T10:00:00Z",
        user: null,
      });

      // Act
      const result = OrderRefundsViewModel.canEditRefund(manualRefund);

      // Assert
      expect(result).toBe(false);
    });

    it("should return false for refunds that are successful AND manual", () => {
      // Arrange
      const successfulManualRefund = createOrderRefundDisplay({
        id: "manual-success-1",
        type: "manual" as const,
        status: OrderGrantedRefundStatusEnum.SUCCESS,
        amount: { amount: 50, currency: "USD" },
        createdAt: "2023-01-01T10:00:00Z",
        user: null,
      });

      // Act
      const result = OrderRefundsViewModel.canEditRefund(successfulManualRefund);

      // Assert
      expect(result).toBe(false);
    });

    it("should return false for refunds that are pending AND manual", () => {
      // Arrange
      const pendingManualRefund = createOrderRefundDisplay({
        id: "manual-pending-1",
        type: "manual" as const,
        status: OrderGrantedRefundStatusEnum.PENDING,
        amount: { amount: 50, currency: "USD" },
        createdAt: "2023-01-01T10:00:00Z",
        user: null,
      });

      // Act
      const result = OrderRefundsViewModel.canEditRefund(pendingManualRefund);

      // Assert
      expect(result).toBe(false);
    });

    it("should return true for NONE status standard refunds", () => {
      // Arrange
      const noneStatusRefund = createOrderRefundDisplay({
        status: OrderGrantedRefundStatusEnum.NONE,
        type: "standard",
      });

      // Act
      const result = OrderRefundsViewModel.canEditRefund(noneStatusRefund);

      // Assert
      expect(result).toBe(true);
    });
  });

  describe("getRefundState", () => {
    const { transactions: baseTransactions } = OrderFixture.fulfilled().withTransaction().build();

    it("should return noTransactionsToRefund when transactions array is empty", () => {
      // Arrange
      const transactions: any[] = [];

      // Act
      const result = OrderRefundsViewModel.getRefundState(transactions);

      // Assert
      expect(result).toBe("noTransactionsToRefund");
    });

    it("should return allTransactionsNonRefundable when no transactions have REFUND action", () => {
      // Arrange
      const transactions = [
        {
          ...baseTransactions[0],
          id: "tx-1",
          actions: [TransactionActionEnum.CHARGE, TransactionActionEnum.CANCEL],
        },
        {
          ...baseTransactions[0],
          id: "tx-2",
          actions: [TransactionActionEnum.CHARGE],
        },
      ];

      // Act
      const result = OrderRefundsViewModel.getRefundState(transactions);

      // Assert
      expect(result).toBe("allTransactionsNonRefundable");
    });

    it("should return refundable when at least one transaction has REFUND action", () => {
      // Arrange
      const transactions = [
        {
          ...baseTransactions[0],
          id: "tx-1",
          actions: [TransactionActionEnum.CHARGE, TransactionActionEnum.CANCEL],
        },
        {
          ...baseTransactions[0],
          id: "tx-2",
          actions: [TransactionActionEnum.REFUND, TransactionActionEnum.CHARGE],
        },
      ];

      // Act
      const result = OrderRefundsViewModel.getRefundState(transactions);

      // Assert
      expect(result).toBe("refundable");
    });

    it("should return refundable when all transactions have REFUND action", () => {
      // Arrange
      const transactions = [
        {
          ...baseTransactions[0],
          id: "tx-1",
          actions: [TransactionActionEnum.REFUND, TransactionActionEnum.CHARGE],
        },
        {
          ...baseTransactions[0],
          id: "tx-2",
          actions: [TransactionActionEnum.REFUND],
        },
      ];

      // Act
      const result = OrderRefundsViewModel.getRefundState(transactions);

      // Assert
      expect(result).toBe("refundable");
    });

    it("should return allTransactionsNonRefundable when transactions have empty actions array", () => {
      // Arrange
      const transactions = [
        {
          ...baseTransactions[0],
          id: "tx-1",
          actions: [],
        },
        {
          ...baseTransactions[0],
          id: "tx-2",
          actions: [],
        },
      ];

      // Act
      const result = OrderRefundsViewModel.getRefundState(transactions);

      // Assert
      expect(result).toBe("allTransactionsNonRefundable");
    });

    it("should return allTransactionsNonRefundable for single transaction without REFUND action", () => {
      // Arrange
      const transactions = [
        {
          ...baseTransactions[0],
          id: "tx-1",
          actions: [TransactionActionEnum.CHARGE, TransactionActionEnum.CANCEL],
        },
      ];

      // Act
      const result = OrderRefundsViewModel.getRefundState(transactions);

      // Assert
      expect(result).toBe("allTransactionsNonRefundable");
    });

    it("should return refundable for single transaction with REFUND action", () => {
      // Arrange
      const transactions = [
        {
          ...baseTransactions[0],
          id: "tx-1",
          actions: [TransactionActionEnum.REFUND],
        },
      ];

      // Act
      const result = OrderRefundsViewModel.getRefundState(transactions);

      // Assert
      expect(result).toBe("refundable");
    });
  });
});
