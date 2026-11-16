import { InMemoryCache } from "@apollo/client";
import { MockedProvider, type MockedResponse } from "@apollo/client/testing";
import { PromotionMetadataDocument, type PromotionMetadataQuery } from "@dashboard/graphql";
import introspectionQueryResultData from "@dashboard/graphql/fragmentTypes.generated";
import { allPermissions } from "@dashboard/hooks/makeQuery";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { createPromotionMetadata, promotionId } from "./fixtures";
import { PromotionMetadataDialog } from "./PromotionMetadataDialog";

// Generated query hooks send a PERMISSION_* variable for every permission.
const request = {
  query: PromotionMetadataDocument,
  variables: { id: promotionId, ...allPermissions },
};

const renderWithMocks = (
  mocks: Array<MockedResponse<PromotionMetadataQuery>>,
): (() => React.ReactNode) => {
  const StoryWithMocks = (): React.ReactNode => (
    <MockedProvider
      mocks={mocks}
      cache={new InMemoryCache({ possibleTypes: introspectionQueryResultData.possibleTypes })}
    >
      <PromotionMetadataDialog open onClose={fn()} promotionId={promotionId} />
    </MockedProvider>
  );

  return StoryWithMocks;
};

const meta: Meta<typeof PromotionMetadataDialog> = {
  title: "Discounts / PromotionMetadataDialog",
  component: PromotionMetadataDialog,
};

export default meta;

export const Loaded: StoryObj<typeof PromotionMetadataDialog> = {
  render: renderWithMocks([{ request, result: { data: createPromotionMetadata("SUMMER26") } }]),
};

export const Loading: StoryObj<typeof PromotionMetadataDialog> = {
  render: renderWithMocks([
    { request, result: { data: createPromotionMetadata("SUMMER26") }, delay: Infinity },
  ]),
};

export const LoadFailed: StoryObj<typeof PromotionMetadataDialog> = {
  render: renderWithMocks([{ request, error: new Error("Failed to fetch") }]),
};
