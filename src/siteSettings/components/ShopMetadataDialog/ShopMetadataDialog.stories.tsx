import { InMemoryCache } from "@apollo/client";
import { MockedProvider, type MockedResponse } from "@apollo/client/testing";
import { ShopMetadataDocument, type ShopMetadataQuery } from "@dashboard/graphql";
import introspectionQueryResultData from "@dashboard/graphql/fragmentTypes.generated";
import { allPermissions } from "@dashboard/hooks/makeQuery";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { createShopMetadata } from "./fixtures";
import { ShopMetadataDialog } from "./ShopMetadataDialog";

// Generated query hooks send a PERMISSION_* variable for every permission.
const request = { query: ShopMetadataDocument, variables: allPermissions };

const renderWithMocks = (mocks: Array<MockedResponse<ShopMetadataQuery>>) => {
  const StoryWithMocks = (): React.ReactNode => (
    <MockedProvider
      mocks={mocks}
      cache={new InMemoryCache({ possibleTypes: introspectionQueryResultData.possibleTypes })}
    >
      <ShopMetadataDialog open onClose={fn()} />
    </MockedProvider>
  );

  return StoryWithMocks;
};

const meta: Meta<typeof ShopMetadataDialog> = {
  title: "Site Settings / ShopMetadataDialog",
  component: ShopMetadataDialog,
};

export default meta;

export const Loaded: StoryObj<typeof ShopMetadataDialog> = {
  render: renderWithMocks([{ request, result: { data: createShopMetadata("Example GmbH") } }]),
};

export const Loading: StoryObj<typeof ShopMetadataDialog> = {
  render: renderWithMocks([
    { request, result: { data: createShopMetadata("Example GmbH") }, delay: Infinity },
  ]),
};

export const LoadFailed: StoryObj<typeof ShopMetadataDialog> = {
  render: renderWithMocks([{ request, error: new Error("Failed to fetch") }]),
};
