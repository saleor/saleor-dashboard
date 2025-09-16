import {
  OrderGrantedRefundFragment,
  OrderGrantedRefundStatusEnum,
  TransactionActionEnum,
  TransactionEventFragment,
  TransactionEventTypeEnum,
} from "@dashboard/graphql";

import { OrderFixture } from "../fixtures/order-fixture";
import { OrderRefundsViewModel } from "./order-refunds-view-model";

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
          reason: null,
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
      createdBy: { __typename: "App" as const, id: "app-1", name: "Test App" },
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
      const result = OrderRefundsViewModel["mapEventGroupsToOrderRefunds"](eventsByPspReference);

      // Assert
      expect(result).toStrictEqual([
        expect.objectContaining({
          id: "newer",
          type: "manual",
          status: OrderGrantedRefundStatusEnum.SUCCESS,
          amount: expect.objectContaining({
            amount: 100,
            currency: "USD",
          }),
          createdAt: "2023-01-01T10:00:00Z",
          reason: null,
        }),
      ]);
    });

    it("should use latest event with user author for user information", () => {
      // Arrange
      const appEvent = createTransactionEvent({
        id: "app-event",
        createdAt: "2023-01-01T10:00:00Z",
        createdBy: { __typename: "App" as const, id: "app-1", name: "Test App" },
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
      const result = OrderRefundsViewModel["mapEventGroupsToOrderRefunds"](eventsByPspReference);

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
      const editableRefund = createGrantedRefund({
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
      const successfulRefund = createGrantedRefund({
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
      const pendingRefund = createGrantedRefund({
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
      const manualRefund = {
        id: "manual-1",
        type: "manual" as const,
        status: OrderGrantedRefundStatusEnum.FAILURE,
        amount: { amount: 50, currency: "USD" },
        reason: null,
        createdAt: "2023-01-01T10:00:00Z",
        user: null,
      };

      // Act
      const result = OrderRefundsViewModel.canEditRefund(manualRefund);

      // Assert
      expect(result).toBe(false);
    });

    it("should return false for refunds that are successful AND manual", () => {
      // Arrange
      const successfulManualRefund = {
        id: "manual-success-1",
        type: "manual" as const,
        status: OrderGrantedRefundStatusEnum.SUCCESS,
        amount: { amount: 50, currency: "USD" },
        reason: null,
        createdAt: "2023-01-01T10:00:00Z",
        user: null,
      };

      // Act
      const result = OrderRefundsViewModel.canEditRefund(successfulManualRefund);

      // Assert
      expect(result).toBe(false);
    });

    it("should return false for refunds that are pending AND manual", () => {
      // Arrange
      const pendingManualRefund = {
        id: "manual-pending-1",
        type: "manual" as const,
        status: OrderGrantedRefundStatusEnum.PENDING,
        amount: { amount: 50, currency: "USD" },
        reason: null,
        createdAt: "2023-01-01T10:00:00Z",
        user: null,
      };

      // Act
      const result = OrderRefundsViewModel.canEditRefund(pendingManualRefund);

      // Assert
      expect(result).toBe(false);
    });

    it("should return true for NONE status standard refunds", () => {
      // Arrange
      const noneStatusRefund = createGrantedRefund({
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
