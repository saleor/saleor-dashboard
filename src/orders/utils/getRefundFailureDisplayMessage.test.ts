import { type IntlShape } from "react-intl";

import {
  getRefundFailureDisplayMessage,
  refundFailureDisplayMessages,
} from "./getRefundFailureDisplayMessage";

describe("getRefundFailureDisplayMessage", () => {
  const intl = {
    formatMessage: (descriptor: { defaultMessage: string }) => descriptor.defaultMessage,
  } as IntlShape;

  it("returns provider message when present", () => {
    // Arrange // Act
    const message = getRefundFailureDisplayMessage("Insufficient funds to refund", intl);

    // Assert
    expect(message).toBe("Insufficient funds to refund");
  });

  it("returns generic fallback when provider message is missing", () => {
    // Arrange // Act
    const message = getRefundFailureDisplayMessage(null, intl);

    // Assert
    expect(message).toBe(refundFailureDisplayMessages.generic.defaultMessage);
  });
});
