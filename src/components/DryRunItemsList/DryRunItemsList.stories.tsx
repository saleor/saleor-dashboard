import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  InMemoryCache,
  Observable,
} from "@apollo/client";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ReactNode, useState } from "react";
import { expect, within } from "storybook/test";

import DryRunItemsList from "./DryRunItemsList";

const zones = [
  { id: "U2hpcHBpbmdab25lOjE=", name: "Europe" },
  { id: "U2hpcHBpbmdab25lOjI=", name: "North America" },
  { id: "U2hpcHBpbmdab25lOjM=", name: "Rest of the world" },
];

/**
 * The list picks its own query out of `DocumentMap` and `useQuery` injects every permission
 * flag into the variables, so matching a mock by document+variables is brittle. A link that
 * answers with the same payload regardless of the operation keeps the story about the rows.
 */
const mockedApollo = (data: Record<string, unknown>, { loading = false } = {}) =>
  new ApolloClient({
    cache: new InMemoryCache(),
    defaultOptions: { watchQuery: { fetchPolicy: "no-cache" } },
    link: new ApolloLink(
      () =>
        new Observable(observer =>
          loading ? undefined : (observer.next({ data }), observer.complete()),
        ),
    ),
  });

const zonesData = {
  shippingZones: {
    __typename: "ShippingZoneCountableConnection",
    edges: zones.map(node => ({
      __typename: "ShippingZoneCountableEdge",
      node: {
        __typename: "ShippingZone",
        ...node,
        description: "",
        countries: [],
        priceRange: null,
        metadata: [],
        privateMetadata: [],
      },
    })),
    pageInfo: {
      __typename: "PageInfo",
      endCursor: null,
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: null,
    },
  },
};

const Wrapper = ({ client, children }: { client: ApolloClient<object>; children: ReactNode }) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);

const DryRunItemsListStory = ({
  initialObjectId = "",
  loading = false,
}: {
  initialObjectId?: string;
  loading?: boolean;
}) => {
  const [objectId, setObjectId] = useState(initialObjectId);

  return (
    <Wrapper client={mockedApollo(zonesData, { loading })}>
      <DryRunItemsList object="SHIPPING_PRICE" objectId={objectId} setObjectId={setObjectId} />
    </Wrapper>
  );
};

const meta: Meta<typeof DryRunItemsListStory> = {
  title: "Components/DryRunItemsList",
  component: DryRunItemsListStory,
};

export default meta;
type Story = StoryObj<typeof DryRunItemsListStory>;

export const Loading: Story = {
  args: { loading: true },
};

export const Default: Story = {};

export const WithSelection: Story = {
  args: { initialObjectId: zones[1].id },
};

export const PickingRowSelectsIt: Story = {
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);

    // Arrange
    const row = await canvas.findByText(zones[2].name);

    for (const radio of await canvas.findAllByRole("radio")) {
      await expect(radio).not.toBeChecked();
    }

    // Act — the row owns the selection, the radio only displays it
    await row.click();

    // Assert
    await expect((await canvas.findAllByRole("radio"))[2]).toBeChecked();
  },
};
