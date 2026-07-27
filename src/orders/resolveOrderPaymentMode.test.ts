import { MarkAsPaidStrategyEnum, type OrderDetailsFragment } from "@dashboard/graphql";

import { OrderFixture } from "./fixtures/OrderFixture";
import { type ResolvedOrder, resolveOrderPaymentMode } from "./resolveOrderPaymentMode";

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

describe("resolveOrderPaymentMode", () => {
  // Same scenario table as the classifier characterization, asserted through the
  // discriminated resolver interface. Transaction-wins precedence.
  const cases: Array<{ name: string; order: OrderDetailsFragment; kind: ResolvedOrder["kind"] }> = [
    {
      name: "transactions only -> transactions",
      order: OrderFixture.fulfilled().withTransaction().build(),
      kind: "transactions",
    },
    {
      name: "payments only -> legacy-payments",
      order: OrderFixture.fulfilled().withLegacyPayments().build(),
      kind: "legacy-payments",
    },
    {
      name: "both transactions and payments -> transactions win",
      order: OrderFixture.fulfilled().withLegacyPayments().withTransaction().build(),
      kind: "transactions",
    },
    {
      name: "no history + TRANSACTION_FLOW -> transactions",
      order: OrderFixture.fulfilled()
        .withChannel(channelWithStrategy(MarkAsPaidStrategyEnum.TRANSACTION_FLOW))
        .build(),
      kind: "transactions",
    },
    {
      name: "no history + PAYMENT_FLOW -> legacy-payments",
      order: OrderFixture.fulfilled()
        .withChannel(channelWithStrategy(MarkAsPaidStrategyEnum.PAYMENT_FLOW))
        .build(),
      kind: "legacy-payments",
    },
  ];

  it.each(cases)("$name", ({ order, kind }) => {
    // Arrange - order built above

    // Act
    const resolved = resolveOrderPaymentMode(order);

    // Assert
    expect(resolved.kind).toBe(kind);
    expect(resolved.order).toBe(order);
  });
});
