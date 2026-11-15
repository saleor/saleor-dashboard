import { InMemoryCache } from "@apollo/client";
import { MockedProvider, type MockedResponse } from "@apollo/client/testing";
import {
  OrderMetadataDocument,
  type OrderMetadataQuery,
  type OrderMetadataQueryVariables,
} from "@dashboard/graphql";
import introspectionQueryResultData from "@dashboard/graphql/fragmentTypes.generated";
import { allPermissions } from "@dashboard/hooks/makeQuery";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { LazyMetadataDialog } from "./LazyMetadataDialog";

const orderId = "T3JkZXI6MQ==";
// Generated query hooks send a PERMISSION_* variable for every permission.
const request = { query: OrderMetadataDocument, variables: { id: orderId, ...allPermissions } };

const orderMetadata: OrderMetadataQuery = {
  __typename: "Query",
  order: {
    __typename: "Order",
    id: orderId,
    metadata: [{ __typename: "MetadataItem", key: "erp.orderId", value: "SO-1001" }],
    privateMetadata: [{ __typename: "MetadataItem", key: "erp.syncedAt", value: "2026-11-14" }],
  },
};

const renderWithMocks = (
  mocks: Array<MockedResponse<OrderMetadataQuery>>,
): (() => React.ReactNode) => {
  const StoryWithMocks = (): React.ReactNode => (
    <MockedProvider
      mocks={mocks}
      cache={new InMemoryCache({ possibleTypes: introspectionQueryResultData.possibleTypes })}
    >
      <LazyMetadataDialog<
        OrderMetadataQuery,
        OrderMetadataQueryVariables,
        NonNullable<OrderMetadataQuery["order"]>
      >
        open
        onClose={fn()}
        title="Order Metadata"
        query={OrderMetadataDocument}
        variables={{ id: orderId }}
        select={data => data.order}
      />
    </MockedProvider>
  );

  return StoryWithMocks;
};

const meta: Meta = {
  title: "Components/MetadataDialog/LazyMetadataDialog",
};

export default meta;

export const Loaded: StoryObj = {
  render: renderWithMocks([{ request, result: { data: orderMetadata } }]),
};

export const Loading: StoryObj = {
  render: renderWithMocks([{ request, result: { data: orderMetadata }, delay: Infinity }]),
};

export const LoadFailed: StoryObj = {
  render: renderWithMocks([{ request, error: new Error("Failed to fetch") }]),
};
