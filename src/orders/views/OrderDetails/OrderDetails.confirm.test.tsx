import { ApolloClient, InMemoryCache } from "@apollo/client";
import { type MockedResponse, MockLink } from "@apollo/client/testing";
import {
  OrderConfirmDocument,
  OrderDetailsWithMetadataDocument,
  type OrderDetailsWithMetadataQuery,
  OrderStatus,
} from "@dashboard/graphql";
import { OrderFixture } from "@dashboard/orders/fixtures/OrderFixture";

const ORDER_ID = "unconfirmed-order-id";

const shop = {
  __typename: "Shop" as const,
  countries: [],
  defaultWeightUnit: "KG",
  fulfillmentAllowUnpaid: false,
  fulfillmentAutoApprove: true,
  availablePaymentGateways: [],
};

describe("OrderDetails confirm flow", () => {
  it("updates cached order status after confirm without refetch", async () => {
    // Arrange
    const unconfirmedOrder = OrderFixture.unconfirmed().build();
    const confirmedOrder = {
      ...unconfirmedOrder,
      status: OrderStatus.UNFULFILLED,
    };
    const mocks: MockedResponse[] = [
      {
        request: {
          query: OrderConfirmDocument,
          variables: { id: ORDER_ID },
        },
        result: {
          data: {
            orderConfirm: {
              __typename: "OrderConfirm",
              errors: [],
              order: confirmedOrder,
            },
          },
        },
      },
    ];
    const cache = new InMemoryCache();

    cache.writeQuery({
      query: OrderDetailsWithMetadataDocument,
      variables: { id: ORDER_ID, hasManageProducts: true },
      data: {
        order: unconfirmedOrder,
        shop,
      },
    });

    const client = new ApolloClient({
      cache,
      link: new MockLink(mocks),
    });

    expect(
      cache.readQuery<OrderDetailsWithMetadataQuery>({
        query: OrderDetailsWithMetadataDocument,
        variables: { id: ORDER_ID, hasManageProducts: true },
      })?.order?.status,
    ).toBe(OrderStatus.UNCONFIRMED);

    // Act
    await client.mutate({
      mutation: OrderConfirmDocument,
      variables: { id: ORDER_ID },
    });

    // Assert
    expect(
      cache.readQuery<OrderDetailsWithMetadataQuery>({
        query: OrderDetailsWithMetadataDocument,
        variables: { id: ORDER_ID, hasManageProducts: true },
      })?.order?.status,
    ).toBe(OrderStatus.UNFULFILLED);
  });
});
