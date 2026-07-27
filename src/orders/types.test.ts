import { MarkAsPaidStrategyEnum, type OrderDetailsFragment } from "@dashboard/graphql";

import { OrderFixture } from "./fixtures/OrderFixture";
import { orderShouldUseTransactions } from "./types";

const channelWithStrategy = (
  strategy: MarkAsPaidStrategyEnum,
): OrderDetailsFragment["channel"] => ({
  __typename: "Channel",
  id: "channel-id",
  name: "Default Channel",
  isActive: true,
  currencyCode: "USD",
  slug: "default-channel",
  defaultCountry: { __typename: "CountryDisplay", code: "US" },
  orderSettings: { __typename: "OrderSettings", markAsPaidStrategy: strategy },
});

describe("orderShouldUseTransactions (canonical payment-mode classifier)", () => {
  // Precedence: transactions win, then payments, then the channel mark-as-paid strategy.
  const cases: Array<{ name: string; order: OrderDetailsFragment; expected: boolean }> = [
    {
      name: "transactions only -> transactions",
      order: OrderFixture.fulfilled().withTransaction().build(),
      expected: true,
    },
    {
      name: "payments only -> legacy",
      order: OrderFixture.fulfilled().withLegacyPayments().build(),
      expected: false,
    },
    {
      name: "both transactions and payments -> transactions win",
      order: OrderFixture.fulfilled().withLegacyPayments().withTransaction().build(),
      expected: true,
    },
    {
      name: "no history + TRANSACTION_FLOW -> transactions",
      order: OrderFixture.fulfilled()
        .withChannel(channelWithStrategy(MarkAsPaidStrategyEnum.TRANSACTION_FLOW))
        .build(),
      expected: true,
    },
    {
      name: "no history + PAYMENT_FLOW -> legacy",
      order: OrderFixture.fulfilled()
        .withChannel(channelWithStrategy(MarkAsPaidStrategyEnum.PAYMENT_FLOW))
        .build(),
      expected: false,
    },
  ];

  it.each(cases)("$name", ({ order, expected }) => {
    // Arrange - order built above

    // Act
    const result = orderShouldUseTransactions(order);

    // Assert
    expect(result).toBe(expected);
  });
});
