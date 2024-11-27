import { ActivitiesFragment, OrderEventsEnum } from "@dashboard/graphql";

export const activities = [
  {
    date: "2024-06-17T09:54:02.215733+00:00",
    email: null,
    message: null,
    orderNumber: "3268",
    type: OrderEventsEnum.PLACED_FROM_DRAFT,
    user: {
      email: "renata.gajzlerowicz@saleor.io",
    },
  },
  {
    date: "2024-06-17T09:56:22.893415+00:00",
    email: null,
    message: null,
    orderNumber: "3268",
    type: OrderEventsEnum.ORDER_FULLY_PAID,
    user: null,
  },
] as ActivitiesFragment[];
