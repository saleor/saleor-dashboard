import { ModelsOfTypeDocument } from "@dashboard/graphql";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type MockResponse, withApolloMocks } from "@storybookUtils/apollo";
import { PageFactory } from "@storybookUtils/AssignDialogShared/factories";
import { fn } from "storybook/test";

import { ModelsPicker } from "./ModelsPicker";

const makeModelsOfTypeMock = (models: Array<{ id: string; title: string }>): MockResponse => ({
  query: ModelsOfTypeDocument,
  data: {
    pages: {
      edges: models.map(model => ({
        node: model,
      })),
    },
  },
});

const pagesPromise = PageFactory.buildList(3);

const mockField = {
  name: "modelId" as const,
  value: "",
  onChange: fn(),
  onBlur: fn(),
  ref: () => {},
};

const meta: Meta<typeof ModelsPicker> = {
  title: "components/ModelsPicker",
  component: ModelsPicker,
  decorators: [withApolloMocks(pagesPromise.then(pages => [makeModelsOfTypeMock(pages)]))],
  args: {
    referenceModelTypeId: "page-type-1",
    disabled: false,
    field: mockField,
    emptyOptionLabel: "Select a model",
    sortByName: false,
    skip: false,
  },
  argTypes: {
    field: { table: { disable: true } },
    skip: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof ModelsPicker>;

export const Default: Story = {};

export const SortedByName: Story = {
  args: {
    sortByName: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Empty: Story = {
  decorators: [withApolloMocks([makeModelsOfTypeMock([])])],
};

export const WithSelectedValue: Story = {
  args: {
    field: { ...mockField, value: "model-2" },
  },
};
