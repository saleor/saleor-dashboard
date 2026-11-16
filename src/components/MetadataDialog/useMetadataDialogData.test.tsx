import { InMemoryCache } from "@apollo/client";
import { MockedProvider, type MockedResponse } from "@apollo/client/testing";
import {
  OrderMetadataDocument,
  type OrderMetadataQuery,
  type OrderMetadataQueryVariables,
} from "@dashboard/graphql";
import introspectionQueryResultData from "@dashboard/graphql/fragmentTypes.generated";
import { allPermissions } from "@dashboard/hooks/makeQuery";
import { act, renderHook, waitFor } from "@testing-library/react";
import { GraphQLError } from "graphql";
import type { ReactNode } from "react";
import { IntlProvider } from "react-intl";

import { useMetadataDialogData } from "./useMetadataDialogData";

const mockNotify = jest.fn();

jest.mock("@dashboard/hooks/useNotifier/useNotifier", () => ({
  useNotifier: () => mockNotify,
}));

type Order = NonNullable<OrderMetadataQuery["order"]>;

const orderId = "T3JkZXI6MQ==";
// Generated query hooks send a PERMISSION_* variable for every permission.
const orderMetadataRequest = {
  query: OrderMetadataDocument,
  variables: { id: orderId, ...allPermissions },
};

const order: Order = {
  __typename: "Order",
  id: orderId,
  metadata: [{ __typename: "MetadataItem", key: "erp.orderId", value: "SO-1001" }],
  privateMetadata: [],
};

const renderData = (mocks: MockedResponse[]) => {
  // possibleTypes lets the `...Metadata` fragment (on ObjectWithMetadata) match Order,
  // like in the app's client.
  const cache = new InMemoryCache({ possibleTypes: introspectionQueryResultData.possibleTypes });
  const Wrapper = ({ children }: { children: ReactNode }): React.ReactNode => (
    <MockedProvider mocks={mocks} cache={cache}>
      <IntlProvider defaultLocale="en" locale="en">
        {children}
      </IntlProvider>
    </MockedProvider>
  );

  return renderHook(
    () =>
      useMetadataDialogData<OrderMetadataQuery, OrderMetadataQueryVariables, Order>({
        query: OrderMetadataDocument,
        variables: { id: orderId },
        select: data => data.order,
      }),
    { wrapper: Wrapper },
  );
};

describe("useMetadataDialogData", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows a load error when the first answer doesn't have the object", async () => {
    // Arrange
    const { result } = renderData([
      { request: orderMetadataRequest, result: { data: { __typename: "Query", order: null } } },
    ]);

    // Act
    await waitFor(() => expect(result.current.contentLoading).toBe(false));

    // Assert
    expect(result.current.entity).toBeUndefined();
    expect(result.current.loadError).toBe(true);
  });

  it("keeps the loaded object when a later reload comes back with an error and without it", async () => {
    // Arrange
    const reload = jest.fn(() => ({
      data: { __typename: "Query" as const, order: null },
      errors: [new GraphQLError("Internal Server Error")],
    }));
    const { result } = renderData([
      { request: orderMetadataRequest, result: { data: { __typename: "Query", order } } },
      { request: orderMetadataRequest, result: reload },
    ]);

    await waitFor(() => expect(result.current.entity?.id).toBe(orderId));

    // Act
    act(() => {
      result.current.onRetryLoad();
    });
    await waitFor(() => expect(reload).toHaveBeenCalledTimes(1));
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    // Assert
    expect(result.current.entity?.metadata).toEqual(order.metadata);
    expect(result.current.loadError).toBe(false);
    expect(result.current.contentLoading).toBe(false);
  });
});
