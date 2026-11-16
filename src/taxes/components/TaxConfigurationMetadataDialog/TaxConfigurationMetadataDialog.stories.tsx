import { InMemoryCache } from "@apollo/client";
import { MockedProvider, type MockedResponse } from "@apollo/client/testing";
import {
  TaxConfigurationMetadataDocument,
  type TaxConfigurationMetadataQuery,
} from "@dashboard/graphql";
import introspectionQueryResultData from "@dashboard/graphql/fragmentTypes.generated";
import { allPermissions } from "@dashboard/hooks/makeQuery";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { createTaxConfigurationMetadata, taxConfigurationId } from "./fixtures";
import { TaxConfigurationMetadataDialog } from "./TaxConfigurationMetadataDialog";

// Generated query hooks send a PERMISSION_* variable for every permission.
const request = {
  query: TaxConfigurationMetadataDocument,
  variables: { id: taxConfigurationId, ...allPermissions },
};

const renderWithMocks = (
  mocks: Array<MockedResponse<TaxConfigurationMetadataQuery>>,
): (() => React.ReactNode) => {
  const StoryWithMocks = (): React.ReactNode => (
    <MockedProvider
      mocks={mocks}
      cache={new InMemoryCache({ possibleTypes: introspectionQueryResultData.possibleTypes })}
    >
      <TaxConfigurationMetadataDialog
        open
        onClose={fn()}
        taxConfigurationId={taxConfigurationId}
        channelName="Channel EUR"
      />
    </MockedProvider>
  );

  return StoryWithMocks;
};

const meta: Meta<typeof TaxConfigurationMetadataDialog> = {
  title: "Taxes/TaxConfigurationMetadataDialog",
  component: TaxConfigurationMetadataDialog,
};

export default meta;

export const Loaded: StoryObj<typeof TaxConfigurationMetadataDialog> = {
  render: renderWithMocks([
    { request, result: { data: createTaxConfigurationMetadata("EU-standard") } },
  ]),
};

export const Loading: StoryObj<typeof TaxConfigurationMetadataDialog> = {
  render: renderWithMocks([
    { request, result: { data: createTaxConfigurationMetadata("EU-standard") }, delay: Infinity },
  ]),
};

export const LoadFailed: StoryObj<typeof TaxConfigurationMetadataDialog> = {
  render: renderWithMocks([{ request, error: new Error("Failed to fetch") }]),
};
