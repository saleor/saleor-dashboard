import { AccountErrorFragment, OrderErrorFragment } from "@dashboard/graphql";
import getAccountErrorMessage from "@dashboard/utils/errors/account";
import getOrderErrorMessage from "@dashboard/utils/errors/order";
import { IntlShape } from "react-intl";
import { Mock } from "vitest";

import { getErrorMessage } from "./getErrorMessage";

vi.mock("@dashboard/utils/errors/account", () => ({ default: vi.fn() }));
vi.mock("@dashboard/utils/errors/order", () => ({ default: vi.fn() }));

describe("getErrorMessage", () => {
  it("returns original message when it exist", () => {
    // Arrange
    const error = {
      __typename: "AccountError",
      message: "test message",
      code: "INVALID",
    } as AccountErrorFragment;
    const intlShape = {} as IntlShape;

    // Act
    const message = getErrorMessage(error, intlShape);

    // Assert
    expect(message).toBe("test message");
  });

  it("returns account error message", () => {
    // Arrange
    const error = {
      __typename: "AccountError",
      message: null,
      code: "INVALID",
    } as AccountErrorFragment;
    const intlShape = {} as IntlShape;
    (getAccountErrorMessage as Mock).mockReturnValue("account error message");

    // Act
    const message = getErrorMessage(error, intlShape);

    // Assert
    expect(message).toBe("account error message");
  });

  it("returns account error message", () => {
    // Arrange
    const error = {
      __typename: "OrderError",
      message: null,
      code: "INVALID",
    } as unknown as OrderErrorFragment;
    const intlShape = {} as IntlShape;
    (getOrderErrorMessage as Mock).mockReturnValue("order error message");

    // Act
    const message = getErrorMessage(error, intlShape);

    // Assert
    expect(message).toBe("order error message");
  });
});
