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
  // {
  //   date: "2024-06-17T10:07:02.403969+00:00",
  //   email: null,
  //   message: null,
  //   orderNumber: "3269",
  //   type: OrderEventsEnum.ORDER_FULLY_PAID,
  //   user: null,
  // },
  // {
  //   date: "2024-06-17T10:08:08.378184+00:00",
  //   email: null,
  //   message: null,
  //   orderNumber: "3269",
  //   type: OrderEventsEnum.PLACED_FROM_DRAFT,
  //   user: {
  //     email: "renata.gajzlerowicz@saleor.io",
  //   },
  // },
  // {
  //   date: "2024-06-17T10:08:08.396081+00:00",
  //   email: null,
  //   message: null,
  //   orderNumber: "3269",
  //   type: OrderEventsEnum.ORDER_FULLY_PAID,
  //   user: {
  //     email: "renata.gajzlerowicz@saleor.io",
  //   },
  // },
] as ActivitiesFragment[];
