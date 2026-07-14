import { type OrderEventFragment, OrderEventsEnum } from "@dashboard/graphql";
import { type IntlShape } from "react-intl";

import { getEventMessage } from "./messages";

const createIntlMock = (): IntlShape =>
  ({
    formatMessage: (descriptor: { defaultMessage?: string }, values?: Record<string, unknown>) => {
      if (values?.warehouseName) {
        return `warehouse:${values.warehouseName}`;
      }

      if (values?.quantity !== undefined) {
        return `quantity:${values.quantity}`;
      }

      return descriptor.defaultMessage ?? "";
    },
  }) as IntlShape;

const createEvent = (overrides: Partial<OrderEventFragment>): OrderEventFragment =>
  ({
    __typename: "OrderEvent",
    id: "event-1",
    amount: null,
    shippingCostsIncluded: null,
    date: null,
    email: null,
    emailType: null,
    invoiceNumber: null,
    message: null,
    quantity: null,
    transactionReference: null,
    type: OrderEventsEnum.OTHER,
    composedId: null,
    discount: null,
    relatedOrder: null,
    related: null,
    user: null,
    app: null,
    lines: null,
    warehouse: null,
    ...overrides,
  }) as OrderEventFragment;

describe("getEventMessage", () => {
  it("passes warehouse name for restocked items events", () => {
    // Arrange
    const intl = createIntlMock();
    const event = createEvent({
      type: OrderEventsEnum.FULFILLMENT_RESTOCKED_ITEMS,
      quantity: 3,
      warehouse: { __typename: "Warehouse", id: "wh-1", name: "Europe" },
    });

    // Act
    const message = getEventMessage(event, intl);

    // Assert
    expect(message).toBe("warehouse:Europe");
  });

  it("falls back when restocked items event has no warehouse", () => {
    // Arrange
    const intl = createIntlMock();
    const event = createEvent({
      type: OrderEventsEnum.FULFILLMENT_RESTOCKED_ITEMS,
      quantity: 1,
      warehouse: null,
    });

    // Act
    const message = getEventMessage(event, intl);

    // Assert
    expect(message).toBe("quantity:1");
  });
});
