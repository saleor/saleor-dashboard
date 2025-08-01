import { OrderDetailsFragment, OrderStatus } from "@dashboard/graphql";

export const fulfilledOrderFixture = {
  __typename: "Order",
  status: OrderStatus.FULFILLED,
  number: "12345",
  created: "2023-10-01T12:00:00Z",
  channel: {
    id: "channel-id",
    name: "Default Channel",
  },
} satisfies OrderDetailsFragment;
