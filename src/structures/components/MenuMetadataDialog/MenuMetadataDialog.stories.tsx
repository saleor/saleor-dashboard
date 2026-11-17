import { InMemoryCache } from "@apollo/client";
import { MockedProvider, type MockedResponse } from "@apollo/client/testing";
import {
  MenuMetadataDocument,
  type MenuMetadataQuery,
  type MenuMetadataQueryVariables,
} from "@dashboard/graphql";
import introspectionQueryResultData from "@dashboard/graphql/fragmentTypes.generated";
import { allPermissions } from "@dashboard/hooks/makeQuery";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { createMenuMetadata, menuMetadataMenuId } from "./fixtures";
import { MenuMetadataDialog } from "./MenuMetadataDialog";

// Generated query hooks send a PERMISSION_* variable for every permission.
const variables: MenuMetadataQueryVariables = { id: menuMetadataMenuId, ...allPermissions };
const request = { query: MenuMetadataDocument, variables };

const renderWithMocks = (
  mocks: Array<MockedResponse<MenuMetadataQuery>>,
): (() => React.ReactNode) => {
  const StoryWithMocks = (): React.ReactNode => (
    <MockedProvider
      mocks={mocks}
      cache={new InMemoryCache({ possibleTypes: introspectionQueryResultData.possibleTypes })}
    >
      <MenuMetadataDialog menuId={menuMetadataMenuId} open onClose={fn()} />
    </MockedProvider>
  );

  return StoryWithMocks;
};

const meta: Meta<typeof MenuMetadataDialog> = {
  title: "Structures/MenuMetadataDialog",
  component: MenuMetadataDialog,
};

export default meta;

export const Loaded: StoryObj<typeof MenuMetadataDialog> = {
  render: renderWithMocks([{ request, result: { data: createMenuMetadata("header") } }]),
};

export const Loading: StoryObj<typeof MenuMetadataDialog> = {
  render: renderWithMocks([
    { request, result: { data: createMenuMetadata("header") }, delay: Infinity },
  ]),
};

export const LoadFailed: StoryObj<typeof MenuMetadataDialog> = {
  render: renderWithMocks([{ request, error: new Error("Failed to fetch") }]),
};
