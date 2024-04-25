// @ts-strict-ignore
import { IMoney } from "@dashboard/utils/intl";
import { IntlShape } from "react-intl";

import { Locale } from "../Locale";
import { getMoneyRange } from "./utils";

const intl = {
  formatMessage: ({ defaultMessage }, params) => {
    if (defaultMessage.includes("{money}")) {
      return defaultMessage.replace("{money}", params.money);
    }

    return defaultMessage;
  },
} as IntlShape;

describe("getMoneyRange", () => {
  it("should return - when no from and to values", () => {
    // Arrange & Act
    const result = getMoneyRange(Locale.PL, intl);

    // Assert
    expect(result).toBe("-");
  });
  it("should return formated money with currency when from and to have same amount", () => {
    // Arrange
    const fromMoney: IMoney = {
      amount: 10,
      currency: "eur",
    };
    const toMoney: IMoney = {
      amount: 10,
      currency: "eur",
    };
    //  Act & Assert

    expect(getMoneyRange(Locale.EN, intl, fromMoney, toMoney)).toBe("€10.00");
  });
  it("should return formated money range when from and to have different amount", () => {
    // Arrange
    const fromMoney: IMoney = {
      amount: 10,
      currency: "eur",
    };
    const toMoney: IMoney = {
      amount: 20,
      currency: "eur",
    };
    //  Act & Assert

    expect(getMoneyRange(Locale.EN, intl, fromMoney, toMoney)).toBe("€10.00 - €20.00");
  });
  it("should return formated money  when only from is provided", () => {
    // Arrange
    const fromMoney: IMoney = {
      amount: 10,
      currency: "eur",
    };

    //  Act & Assert

    expect(getMoneyRange(Locale.EN, intl, fromMoney)).toBe("from €10.00");
  });
  it("should return formated money  when only to is provided", () => {
    // Arrange
    const toMoney: IMoney = {
      amount: 10,
      currency: "eur",
    };

    //  Act & Assert

    expect(getMoneyRange(Locale.EN, intl, undefined, toMoney)).toBe("to €10.00");
  });
});
