import { MockedProvider, type MockedResponse } from "@apollo/client/testing";
import {
  AttributeEntityTypeEnum,
  SearchPagesDocument,
  type SearchPagesQuery,
} from "@dashboard/graphql";
import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { ReferenceList } from "./ReferenceList";
import { ReferenceValueChip } from "./referenceValueAppearance";

const meta: Meta<typeof ReferenceList> = {
  title: "Components / ReferenceList",
  component: ReferenceList,
};

export default meta;

type Story = StoryObj<typeof ReferenceList>;

export const Products: Story = {
  args: {
    onRemove: fn(),
    onRemoveAll: fn(),
    onReorder: fn(),
    values: [
      { label: "Alpine Oak Coffee Table", value: "p1", url: "/products/p1" },
      { label: "Andean Wool Throw", value: "p2", url: "/products/p2" },
      { label: "Apple Juice Concentrate 5L", value: "p3", url: "/products/p3" },
      { label: "Asanoha Ceramic Bowl", value: "p4", url: "/products/p4" },
      { label: "Monospace Desk Mat", value: "p5", url: "/products/p5" },
      { label: "Birch Ply Stool", value: "p6", url: "/products/p6" },
    ],
    details: [
      { id: "p1", categoryName: "Furniture" },
      { id: "p2", categoryName: "Textiles" },
      { id: "p3", categoryName: "Pantry" },
      { id: "p4", categoryName: "Tableware" },
      { id: "p5", categoryName: "Desk" },
      { id: "p6", categoryName: "Lighting" },
    ],
  },
};

export const Variants: Story = {
  args: {
    onRemove: fn(),
    onRemoveAll: fn(),
    onReorder: fn(),
    entityType: AttributeEntityTypeEnum.PRODUCT_VARIANT,
    values: [
      {
        label: "44 / White",
        value: "v1",
        caption: "White Plimsolls",
        url: "/variants/v1",
      },
      {
        label: "700ml",
        value: "v2",
        caption: "Andean Golden Banana",
        url: "/variants/v2",
      },
      {
        label: "S / Oak",
        value: "v3",
        caption: "Alpine Oak Coffee Table",
        url: "/variants/v3",
      },
    ],
    details: [
      { id: "v1", thumbnailUrl: "https://picsum.photos/id/21/56" },
      { id: "v2", thumbnailUrl: "https://picsum.photos/id/1080/56" },
      { id: "v3", thumbnailUrl: "https://picsum.photos/id/1060/56" },
    ],
  },
};

type ModelPageEdge = NonNullable<SearchPagesQuery["search"]>["edges"][number];

const modelPage = (id: string, title: string, slug: string): ModelPageEdge => ({
  __typename: "PageCountableEdge",
  node: {
    __typename: "Page",
    id,
    title,
    slug,
    pageType: { __typename: "PageType", id: "page-type-1", metadata: [] },
  },
});

const modelDetailsMock: MockedResponse<SearchPagesQuery> = {
  request: {
    query: SearchPagesDocument,
    variables: { first: 2, query: "", where: { ids: ["m1", "m2"] } },
  },
  result: {
    data: {
      __typename: "Query",
      search: {
        __typename: "PageCountableConnection",
        edges: [modelPage("m1", "Supreme", "supreme-eu"), modelPage("m2", "Supreme", "supreme-us")],
        pageInfo: {
          __typename: "PageInfo",
          endCursor: null,
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: null,
        },
      },
    },
  },
};

const withModelDetails = (Story: StoryFn): JSX.Element => (
  <MockedProvider mocks={[modelDetailsMock]}>
    <Story />
  </MockedProvider>
);

/** Models can share a name, so each row shows the model's slug beside it. */
export const Models: Story = {
  decorators: [withModelDetails],
  args: {
    onRemove: fn(),
    onRemoveAll: fn(),
    onReorder: fn(),
    entityType: AttributeEntityTypeEnum.PAGE,
    values: [
      { label: "Supreme", value: "m1", url: "/models/m1" },
      { label: "Supreme", value: "m2", url: "/models/m2" },
    ],
  },
};

/** On a narrow row, each model's slug drops under its name. */
export const ModelsNarrow: Story = {
  ...Models,
  decorators: [
    (Story: StoryFn): JSX.Element => (
      <div style={{ maxWidth: 420 }}>
        <Story />
      </div>
    ),
    withModelDetails,
  ],
};

export const SingleValue: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 24 }}>
      <ReferenceValueChip
        entityType={AttributeEntityTypeEnum.PAGE}
        value={{
          label: "Frutello",
          value: "brand-1",
          url: "/models/brand-1",
          icon: { name: "shapes", color: "grey" },
        }}
        onRemove={() => undefined}
      />
      <ReferenceValueChip
        entityType={AttributeEntityTypeEnum.PRODUCT}
        value={{
          label: "Alpine Oak Coffee Table",
          value: "p1",
          url: "/products/p1",
          thumbnailUrl: "https://picsum.photos/id/1060/56",
        }}
        onRemove={() => undefined}
      />
    </div>
  ),
};
