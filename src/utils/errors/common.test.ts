import { createIntl } from "react-intl";

import { getCommonFormFieldErrorMessage } from "./common";

describe("getCommonFormFieldErrorMessage", () => {
  const intl = createIntl({ locale: "en", messages: {} });

  it("returns API message for unmapped error codes", () => {
    // Arrange // Act
    const message = getCommonFormFieldErrorMessage(
      {
        code: "TRANSACTION_ERROR",
        field: null,
        message: "Orders with transactions can not be manually marked as paid.",
      },
      intl,
    );

    // Assert
    expect(message).toBe("Orders with transactions can not be manually marked as paid.");
  });

  it("falls back to unknown error when no message is provided", () => {
    // Arrange // Act
    const message = getCommonFormFieldErrorMessage(
      {
        code: "TRANSACTION_ERROR",
        field: null,
        message: null,
      },
      intl,
    );

    // Assert
    expect(message).toBe("Unknown error");
  });

  it("keeps localized message for known validation codes", () => {
    // Arrange // Act
    const message = getCommonFormFieldErrorMessage(
      {
        code: "INVALID",
        field: "transactionReference",
        message: "Backend-specific invalid reason",
      },
      intl,
    );

    // Assert
    expect(message).toBe("Invalid value");
  });
});
