import { ModelsOfTypeDocument } from "@dashboard/graphql";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type MockResponse, withApolloMocks } from "@storybookUtils/apollo";

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

const sampleModels = [
  { id: "model-1", title: "Warranty Policy" },
  { id: "model-2", title: "Return Policy" },
  { id: "model-3", title: "About Us" },
];

const mockField = {
  name: "modelId" as const,
  value: "",
  onChange: () => {},
  onBlur: () => {},
  ref: () => {},
};

const meta: Meta<typeof ModelsPicker> = {
  title: "components/ModelsPicker",
  component: ModelsPicker,
  decorators: [withApolloMocks([makeModelsOfTypeMock(sampleModels)])],
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
