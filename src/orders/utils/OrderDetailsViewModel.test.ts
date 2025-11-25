import {
  GiftCardEventsEnum,
  OrderAction,
  OrderDetailsFragment,
  OrderStatus,
} from "@dashboard/graphql";

import { prepareMoney } from "../fixtures";
import { OrderDetailsViewModel, OrderTotalAmounts } from "./OrderDetailsViewModel";

describe("OrderModel", () => {
  describe("shouldShowInvoiceList", () => {
    it.each([
      [OrderStatus.UNCONFIRMED, false],
      [OrderStatus.DRAFT, true],
      [OrderStatus.FULFILLED, true],
      [OrderStatus.UNFULFILLED, true],
      [OrderStatus.PARTIALLY_FULFILLED, true],
      [OrderStatus.CANCELED, true],
      [OrderStatus.RETURNED, true],
      [OrderStatus.PARTIALLY_RETURNED, true],
      [OrderStatus.EXPIRED, true],
    ])("should return %s when order status is %s", (status, expected) => {
      const result = OrderDetailsViewModel.shouldShowInvoiceList(status);

      expect(result).toBe(expected);
    });
  });

  describe("shouldShowCustomerNote", () => {
    it("should return false when customerNote is empty string", () => {
      const customerNote = "";

      const result = OrderDetailsViewModel.shouldShowCustomerNote(customerNote);

      expect(result).toBe(false);
    });

    it("should return true when customerNote has content", () => {
      const customerNote = "Please handle with care";

      const result = OrderDetailsViewModel.shouldShowCustomerNote(customerNote);

      expect(result).toBe(true);
    });
  });

  describe("getShouldDisplayAmounts", () => {
    const orderTotalAmounts: OrderTotalAmounts = {
      total: {
        __typename: "TaxedMoney",
        gross: prepareMoney(0),
        net: prepareMoney(0),
        tax: prepareMoney(0),
      },
      totalAuthorized: prepareMoney(0),
      totalAuthorizePending: prepareMoney(0),
      totalBalance: prepareMoney(15),
      totalCanceled: prepareMoney(0),
      totalCancelPending: prepareMoney(0),
      totalCaptured: prepareMoney(0),
      totalCharged: prepareMoney(0),
      totalChargePending: prepareMoney(0),
      totalRefunded: prepareMoney(0),
    };

    it("hides everything when no order is passed", () => {
      expect(OrderDetailsViewModel.getShouldDisplayAmounts(null)).toStrictEqual(
        expect.objectContaining({
          authorized: false,
          charged: false,
          cancelled: false,
          authorizedPending: false,
          chargedPending: false,
          cancelledPending: false,
        }),
      );
    });

    it("displays everything, but authorized if there's a pending value", () => {
      expect(
        OrderDetailsViewModel.getShouldDisplayAmounts({
          ...orderTotalAmounts,
          totalCharged: prepareMoney(1),
          totalChargePending: prepareMoney(1),
        }),
      ).toStrictEqual({
        authorized: false,
        charged: true,
        cancelled: true,
        authorizedPending: false,
        chargedPending: true,
        cancelledPending: false,
      });
    });

    it("displays everything with authorized if there's a pending value", () => {
      const result1 = OrderDetailsViewModel.getShouldDisplayAmounts({
        ...orderTotalAmounts,
        totalAuthorized: prepareMoney(12),
        totalAuthorizePending: prepareMoney(0),
        totalChargePending: prepareMoney(1),
      });

      expect(result1).toStrictEqual({
        authorized: true,
        charged: true,
        cancelled: true,
        authorizedPending: false,
        chargedPending: true,
        cancelledPending: false,
      });
    });

    it("displays capture and authorize amount when they are different", () => {
      expect(
        OrderDetailsViewModel.getShouldDisplayAmounts({
          ...orderTotalAmounts,
          totalAuthorized: prepareMoney(10),
          totalCharged: prepareMoney(12),
        }),
      ).toStrictEqual({
        authorized: true,
        charged: true,
        cancelled: false,
        authorizedPending: false,
        chargedPending: false,
        cancelledPending: false,
      });
    });

    it("displays capture amount when it's not equal to total amount", () => {
      expect(
        OrderDetailsViewModel.getShouldDisplayAmounts({
          ...orderTotalAmounts,
          totalAuthorized: prepareMoney(0),
          totalCharged: prepareMoney(12),
          total: {
            gross: prepareMoney(13),
            net: prepareMoney(13),
            tax: prepareMoney(0),
            __typename: "TaxedMoney",
          },
        }),
      ).toStrictEqual({
        authorized: false,
        charged: true,
        cancelled: false,
        authorizedPending: false,
        chargedPending: false,
        cancelledPending: false,
      });
    });

    it("displays authorized if there is authorized amount", () => {
      expect(
        OrderDetailsViewModel.getShouldDisplayAmounts({
          ...orderTotalAmounts,
          totalAuthorized: prepareMoney(10),
          totalCharged: prepareMoney(0),
        }),
      ).toStrictEqual({
        authorized: true,
        charged: false,
        cancelled: false,
        authorizedPending: false,
        chargedPending: false,
        cancelledPending: false,
      });
    });

    it("hides everything if order is fully settled", () => {
      expect(
        OrderDetailsViewModel.getShouldDisplayAmounts({
          ...orderTotalAmounts,
          totalCharged: prepareMoney(1),
          total: {
            tax: prepareMoney(0),
            net: prepareMoney(1),
            gross: prepareMoney(1),
            __typename: "TaxedMoney",
          },
          totalAuthorized: prepareMoney(0),
          totalChargePending: prepareMoney(0),
          totalAuthorizePending: prepareMoney(0),
          totalCancelPending: prepareMoney(0),
        }),
      ).toStrictEqual({
        authorized: false,
        charged: false,
        cancelled: false,
        authorizedPending: false,
        chargedPending: false,
        cancelledPending: false,
      });
    });
  });

  describe("getGiftCardAmountUsed", () => {
    // Arrange
    const orderId = "test-order-123";
    const giftCardBalance = {
      __typename: "GiftCardEventBalance" as const,
      initialBalance: prepareMoney(0),
      currentBalance: prepareMoney(50),
      oldInitialBalance: prepareMoney(0),
      oldCurrentBalance: prepareMoney(100),
    };

    it("should return null when no gift cards are provided", () => {
      // Arrange
      const args = {
        id: orderId,
        giftCards: [],
      };

      // Act
      const result = OrderDetailsViewModel.getGiftCardsAmountUsed(args);

      // Assert
      expect(result).toBe(null);
    });

    it("should return null when gift cards have no USED_IN_ORDER events", () => {
      // Arrange
      const giftCards = [
        {
          __typename: "GiftCard" as const,
          id: "gift-card-1",
          last4CodeChars: "1234",
          events: [
            {
              __typename: "GiftCardEvent" as const,
              id: "event-1",
              type: GiftCardEventsEnum.ACTIVATED,
              orderId: null,
              date: "2024-01-01",
              balance: giftCardBalance,
            },
          ],
        },
      ];
      const args = {
        id: orderId,
        giftCards,
      };

      // Act
      const result = OrderDetailsViewModel.getGiftCardsAmountUsed(args);

      // Assert
      expect(result).toBe(null);
    });

    it("should return null when USED_IN_ORDER events don't match the order ID", () => {
      // Arrange
      const giftCards = [
        {
          __typename: "GiftCard" as const,
          id: "gift-card-1",
          last4CodeChars: "1234",
          events: [
            {
              __typename: "GiftCardEvent" as const,
              id: "event-1",
              type: GiftCardEventsEnum.USED_IN_ORDER,
              orderId: "different-order-456",
              date: "2024-01-01",
              balance: giftCardBalance,
            },
          ],
        },
      ];
      const args = {
        id: orderId,
        giftCards,
      };

      // Act
      const result = OrderDetailsViewModel.getGiftCardsAmountUsed(args);

      // Assert
      expect(result).toBe(null);
    });

    it("should return amount used when single gift card was used in order", () => {
      // Arrange
      const usedAmount = 50;
      const balance = {
        __typename: "GiftCardEventBalance" as const,
        initialBalance: prepareMoney(0),
        currentBalance: prepareMoney(50),
        oldInitialBalance: prepareMoney(0),
        oldCurrentBalance: prepareMoney(100),
      };
      const giftCards = [
        {
          __typename: "GiftCard" as const,
          id: "gift-card-1",
          last4CodeChars: "1234",
          events: [
            {
              __typename: "GiftCardEvent" as const,
              id: "event-1",
              type: GiftCardEventsEnum.USED_IN_ORDER,
              orderId,
              date: "2024-01-01",
              balance,
            },
          ],
        },
      ];
      const args = {
        id: orderId,
        giftCards,
      };

      // Act
      const result = OrderDetailsViewModel.getGiftCardsAmountUsed(args);

      // Assert
      expect(result).toBe(usedAmount);
    });

    it("should return total amount used when multiple gift cards were used in order", () => {
      // Arrange
      const firstCardBalance = {
        __typename: "GiftCardEventBalance" as const,
        initialBalance: prepareMoney(0),
        currentBalance: prepareMoney(50),
        oldInitialBalance: prepareMoney(0),
        oldCurrentBalance: prepareMoney(100),
      };
      const secondCardBalance = {
        __typename: "GiftCardEventBalance" as const,
        initialBalance: prepareMoney(0),
        currentBalance: prepareMoney(25),
        oldInitialBalance: prepareMoney(0),
        oldCurrentBalance: prepareMoney(75),
      };
      const giftCards = [
        {
          __typename: "GiftCard" as const,
          id: "gift-card-1",
          last4CodeChars: "1234",
          events: [
            {
              __typename: "GiftCardEvent" as const,
              id: "event-1",
              type: GiftCardEventsEnum.USED_IN_ORDER,
              orderId,
              date: "2024-01-01",
              balance: firstCardBalance,
            },
          ],
        },
        {
          __typename: "GiftCard" as const,
          id: "gift-card-2",
          last4CodeChars: "5678",
          events: [
            {
              __typename: "GiftCardEvent" as const,
              id: "event-2",
              type: GiftCardEventsEnum.USED_IN_ORDER,
              orderId,
              date: "2024-01-01",
              balance: secondCardBalance,
            },
          ],
        },
      ];
      const args = {
        id: orderId,
        giftCards,
      };

      // Act
      const result = OrderDetailsViewModel.getGiftCardsAmountUsed(args);

      // Assert
      expect(result).toBe(100); // 50 + 50 = 100
    });

    it("should handle gift card with multiple events and only use USED_IN_ORDER event for the specific order", () => {
      // Arrange
      const usedBalance = {
        __typename: "GiftCardEventBalance" as const,
        initialBalance: prepareMoney(0),
        currentBalance: prepareMoney(30),
        oldInitialBalance: prepareMoney(0),
        oldCurrentBalance: prepareMoney(80),
      };
      const giftCards = [
        {
          __typename: "GiftCard" as const,
          id: "gift-card-1",
          last4CodeChars: "1234",
          events: [
            {
              __typename: "GiftCardEvent" as const,
              id: "event-1",
              type: GiftCardEventsEnum.ACTIVATED,
              orderId: null,
              date: "2024-01-01",
              balance: giftCardBalance,
            },
            {
              __typename: "GiftCardEvent" as const,
              id: "event-2",
              type: GiftCardEventsEnum.USED_IN_ORDER,
              orderId,
              date: "2024-01-02",
              balance: usedBalance,
            },
            {
              __typename: "GiftCardEvent" as const,
              id: "event-3",
              type: GiftCardEventsEnum.USED_IN_ORDER,
              orderId: "different-order-456",
              date: "2024-01-03",
              balance: giftCardBalance,
            },
          ],
        },
      ];
      const args = {
        id: orderId,
        giftCards,
      };

      // Act
      const result = OrderDetailsViewModel.getGiftCardsAmountUsed(args);

      // Assert
      expect(result).toBe(50); // Only the event for this specific order
    });

    it("should throw error when balance is missing", () => {
      // Arrange
      const giftCards = [
        {
          __typename: "GiftCard" as const,
          id: "gift-card-1",
          last4CodeChars: "1234",
          events: [
            {
              __typename: "GiftCardEvent" as const,
              id: "event-1",
              type: GiftCardEventsEnum.USED_IN_ORDER,
              orderId,
              date: "2024-01-01",
              balance: null,
            },
          ],
        },
      ];
      const args = {
        id: orderId,
        giftCards,
      };

      // Act & Assert
      expect(() => OrderDetailsViewModel.getGiftCardsAmountUsed(args)).toThrow(
        "[extractOrderGiftCardUsedAmount] Missing balance",
      );
    });

    it("should throw error when balance is missing", () => {
      // Arrange
      const incompleteBalance: OrderDetailsFragment["giftCards"][0]["events"][0]["balance"] = null;
      const giftCards: OrderDetailsFragment["giftCards"] = [
        {
          __typename: "GiftCard",
          id: "gift-card-1",
          last4CodeChars: "1234",
          events: [
            {
              __typename: "GiftCardEvent",
              id: "event-1",
              type: GiftCardEventsEnum.USED_IN_ORDER,
              orderId: orderId,
              date: "2024-01-01",
              balance: incompleteBalance,
            },
          ],
        },
      ];
      const args = {
        id: orderId,
        giftCards,
      };

      // Act & Assert
      expect(() => OrderDetailsViewModel.getGiftCardsAmountUsed(args)).toThrow(
        "[extractOrderGiftCardUsedAmount] Missing balance",
      );
    });

    it("should throw error when oldCurrentBalance is missing", () => {
      // Arrange
      const incompleteBalance: OrderDetailsFragment["giftCards"][0]["events"][0]["balance"] = {
        __typename: "GiftCardEventBalance",
        initialBalance: prepareMoney(0),
        currentBalance: prepareMoney(50),
        oldInitialBalance: prepareMoney(0),
        oldCurrentBalance: null,
      };

      const giftCards: OrderDetailsFragment["giftCards"] = [
        {
          __typename: "GiftCard",
          id: "gift-card-1",
          last4CodeChars: "1234",
          events: [
            {
              __typename: "GiftCardEvent",
              id: "event-1",
              type: GiftCardEventsEnum.USED_IN_ORDER,
              orderId: orderId,
              date: "2024-01-01",
              balance: incompleteBalance,
            },
          ],
        },
      ];
      const args = {
        id: orderId,
        giftCards,
      };

      // Act & Assert
      expect(() => OrderDetailsViewModel.getGiftCardsAmountUsed(args)).toThrow(
        "[extractOrderGiftCardUsedAmount] Missing balance",
      );
    });

    it("should return 0 when gift card balance didn't change", () => {
      // Arrange
      const unchangedBalance = {
        __typename: "GiftCardEventBalance" as const,
        initialBalance: prepareMoney(0),
        currentBalance: prepareMoney(100),
        oldInitialBalance: prepareMoney(0),
        oldCurrentBalance: prepareMoney(100),
      };
      const giftCards = [
        {
          __typename: "GiftCard" as const,
          id: "gift-card-1",
          last4CodeChars: "1234",
          events: [
            {
              __typename: "GiftCardEvent" as const,
              id: "event-1",
              type: GiftCardEventsEnum.USED_IN_ORDER,
              orderId,
              date: "2024-01-01",
              balance: unchangedBalance,
            },
          ],
        },
      ];
      const args = {
        id: orderId,
        giftCards,
      };

      // Act
      const result = OrderDetailsViewModel.getGiftCardsAmountUsed(args);

      // Assert
      expect(result).toBe(0);
    });
  });

  describe("canOrderCapture", () => {
    it("should return true when CAPTURE action is included", () => {
      // Arrange
      const actions = [OrderAction.CAPTURE, OrderAction.REFUND];

      // Act
      const result = OrderDetailsViewModel.canOrderCapture(actions);

      // Assert
      expect(result).toBe(true);
    });

    it("should return false when CAPTURE action is not included", () => {
      // Arrange
      const actions = [OrderAction.REFUND, OrderAction.VOID];

      // Act
      const result = OrderDetailsViewModel.canOrderCapture(actions);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe("canOrderVoid", () => {
    it("should return true when VOID action is included", () => {
      // Arrange
      const actions = [OrderAction.VOID, OrderAction.REFUND];

      // Act
      const result = OrderDetailsViewModel.canOrderVoid(actions);

      // Assert
      expect(result).toBe(true);
    });

    it("should return false when VOID action is not included", () => {
      // Arrange
      const actions = [OrderAction.REFUND, OrderAction.CAPTURE];

      // Act
      const result = OrderDetailsViewModel.canOrderVoid(actions);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe("canOrderRefund", () => {
    it("should return true when REFUND action is included", () => {
      // Arrange
      const actions = [OrderAction.REFUND, OrderAction.CAPTURE];

      // Act
      const result = OrderDetailsViewModel.canOrderRefund(actions);

      // Assert
      expect(result).toBe(true);
    });

    it("should return false when REFUND action is not included", () => {
      // Arrange
      const actions = [OrderAction.CAPTURE, OrderAction.VOID];

      // Act
      const result = OrderDetailsViewModel.canOrderRefund(actions);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe("canGrantRefund", () => {
    it("should return true when order has transactions", () => {
      // Arrange
      const order = {
        transactions: [{ id: "tx-1" }] as OrderDetailsFragment["transactions"],
        payments: [] as OrderDetailsFragment["payments"],
      };

      // Act
      const result = OrderDetailsViewModel.canGrantRefund(order);

      // Assert
      expect(result).toBe(true);
    });

    it("should return true when order has payments", () => {
      // Arrange
      const order = {
        transactions: [] as OrderDetailsFragment["transactions"],
        payments: [{ id: "pay-1" }] as OrderDetailsFragment["payments"],
      };

      // Act
      const result = OrderDetailsViewModel.canGrantRefund(order);

      // Assert
      expect(result).toBe(true);
    });

    it("should return true when order has both transactions and payments", () => {
      // Arrange
      const order = {
        transactions: [{ id: "tx-1" }] as OrderDetailsFragment["transactions"],
        payments: [{ id: "pay-1" }] as OrderDetailsFragment["payments"],
      };

      // Act
      const result = OrderDetailsViewModel.canGrantRefund(order);

      // Assert
      expect(result).toBe(true);
    });

    it("should return false when order has no transactions or payments", () => {
      // Arrange
      const order = {
        transactions: [] as OrderDetailsFragment["transactions"],
        payments: [] as OrderDetailsFragment["payments"],
      };

      // Act
      const result = OrderDetailsViewModel.canGrantRefund(order);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe("canSendRefund", () => {
    it("should return true when order has granted refunds", () => {
      // Arrange
      const grantedRefunds = [{ id: "refund-1" }] as OrderDetailsFragment["grantedRefunds"];

      // Act
      const result = OrderDetailsViewModel.canSendRefund(grantedRefunds);

      // Assert
      expect(result).toBe(true);
    });

    it("should return false when order has no granted refunds", () => {
      // Arrange
      const grantedRefunds = [] as OrderDetailsFragment["grantedRefunds"];

      // Act
      const result = OrderDetailsViewModel.canSendRefund(grantedRefunds);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe("canAnyRefund", () => {
    it("should return true when order can grant refund", () => {
      // Arrange
      const order = {
        transactions: [{ id: "tx-1" }] as OrderDetailsFragment["transactions"],
        payments: [] as OrderDetailsFragment["payments"],
        grantedRefunds: [] as OrderDetailsFragment["grantedRefunds"],
      };

      // Act
      const result = OrderDetailsViewModel.canAnyRefund(order);

      // Assert
      expect(result).toBe(true);
    });

    it("should return true when order can send refund", () => {
      // Arrange
      const order = {
        transactions: [] as OrderDetailsFragment["transactions"],
        payments: [] as OrderDetailsFragment["payments"],
        grantedRefunds: [{ id: "refund-1" }] as OrderDetailsFragment["grantedRefunds"],
      };

      // Act
      const result = OrderDetailsViewModel.canAnyRefund(order);

      // Assert
      expect(result).toBe(true);
    });

    it("should return true when order can grant and send refund", () => {
      // Arrange
      const order = {
        transactions: [{ id: "tx-1" }] as OrderDetailsFragment["transactions"],
        payments: [] as OrderDetailsFragment["payments"],
        grantedRefunds: [{ id: "refund-1" }] as OrderDetailsFragment["grantedRefunds"],
      };

      // Act
      const result = OrderDetailsViewModel.canAnyRefund(order);

      // Assert
      expect(result).toBe(true);
    });

    it("should return false when order cannot grant or send refund", () => {
      // Arrange
      const order = {
        transactions: [] as OrderDetailsFragment["transactions"],
        payments: [] as OrderDetailsFragment["payments"],
        grantedRefunds: [] as OrderDetailsFragment["grantedRefunds"],
      };

      // Act
      const result = OrderDetailsViewModel.canAnyRefund(order);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe("hasGiftCards", () => {
    it("should return true when giftCardsAmount is positive", () => {
      // Arrange
      const giftCardsAmount = 50;

      // Act
      const result = OrderDetailsViewModel.hasGiftCards(giftCardsAmount);

      // Assert
      expect(result).toBe(true);
    });

    it("should return false when giftCardsAmount is 0", () => {
      // Arrange
      const giftCardsAmount = 0;

      // Act
      const result = OrderDetailsViewModel.hasGiftCards(giftCardsAmount);

      // Assert
      expect(result).toBe(false);
    });

    it("should return false when giftCardsAmount is null", () => {
      // Arrange
      const giftCardsAmount = null;

      // Act
      const result = OrderDetailsViewModel.hasGiftCards(giftCardsAmount);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe("hasNoPayment", () => {
    it("should return true when no refund possible, nothing charged/authorized, and no gift cards", () => {
      // Arrange
      const args = {
        canAnyRefund: false,
        shouldDisplay: {
          charged: false,
          authorized: false,
          cancelled: false,
          authorizedPending: false,
          chargedPending: false,
          cancelledPending: false,
        },
        hasGiftCards: false,
      };

      // Act
      const result = OrderDetailsViewModel.hasNoPayment(args);

      // Assert
      expect(result).toBe(true);
    });

    it("should return false when refund is possible", () => {
      // Arrange
      const args = {
        canAnyRefund: true,
        shouldDisplay: {
          charged: false,
          authorized: false,
          cancelled: false,
          authorizedPending: false,
          chargedPending: false,
          cancelledPending: false,
        },
        hasGiftCards: false,
      };

      // Act
      const result = OrderDetailsViewModel.hasNoPayment(args);

      // Assert
      expect(result).toBe(false);
    });

    it("should return false when amount is charged", () => {
      // Arrange
      const args = {
        canAnyRefund: false,
        shouldDisplay: {
          charged: true,
          authorized: false,
          cancelled: false,
          authorizedPending: false,
          chargedPending: false,
          cancelledPending: false,
        },
        hasGiftCards: false,
      };

      // Act
      const result = OrderDetailsViewModel.hasNoPayment(args);

      // Assert
      expect(result).toBe(false);
    });

    it("should return false when amount is authorized", () => {
      // Arrange
      const args = {
        canAnyRefund: false,
        shouldDisplay: {
          charged: false,
          authorized: true,
          cancelled: false,
          authorizedPending: false,
          chargedPending: false,
          cancelledPending: false,
        },
        hasGiftCards: false,
      };

      // Act
      const result = OrderDetailsViewModel.hasNoPayment(args);

      // Assert
      expect(result).toBe(false);
    });

    it("should return false when gift cards were used", () => {
      // Arrange
      const args = {
        canAnyRefund: false,
        shouldDisplay: {
          charged: false,
          authorized: false,
          cancelled: false,
          authorizedPending: false,
          chargedPending: false,
          cancelledPending: false,
        },
        hasGiftCards: true,
      };

      // Act
      const result = OrderDetailsViewModel.hasNoPayment(args);

      // Assert
      expect(result).toBe(false);
    });
  });
});
