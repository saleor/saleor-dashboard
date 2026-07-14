import { TransactionEventTypeEnum } from "@dashboard/graphql";

import { getGrantedRefundFailureMessage } from "./getGrantedRefundFailureMessage";

describe("getGrantedRefundFailureMessage", () => {
  it("returns the latest refund failure message", () => {
    // Arrange
    const events = [
      {
        type: TransactionEventTypeEnum.REFUND_REQUEST,
        message: "Refund requested",
        createdAt: "2026-07-13T12:00:00Z",
      },
      {
        type: TransactionEventTypeEnum.REFUND_FAILURE,
        message: "Older failure",
        createdAt: "2026-07-13T12:30:00Z",
      },
      {
        type: TransactionEventTypeEnum.REFUND_FAILURE,
        message: "Insufficient funds to refund",
        createdAt: "2026-07-13T12:45:00Z",
      },
    ];

    // Act
    const result = getGrantedRefundFailureMessage(events);

    // Assert
    expect(result).toBe("Insufficient funds to refund");
  });

  it("returns null when no refund failure events exist", () => {
    // Arrange // Act
    const result = getGrantedRefundFailureMessage([
      {
        type: TransactionEventTypeEnum.REFUND_REQUEST,
        message: "Refund requested",
        createdAt: "2026-07-13T12:00:00Z",
      },
    ]);

    // Assert
    expect(result).toBeNull();
  });
});
