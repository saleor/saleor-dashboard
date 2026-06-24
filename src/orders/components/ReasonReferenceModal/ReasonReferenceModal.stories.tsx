import { ModelsOfTypeDocument } from "@dashboard/graphql";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type MockResponse, withApolloMocks } from "@storybookUtils/apollo";
import { PageFactory } from "@storybookUtils/AssignDialogShared/factories";
import { fn } from "storybook/test";

import { ReasonReferenceModal } from "./ReasonReferenceModal";

const makeModelsOfTypeMock = (models: Array<{ id: string; title: string }>): MockResponse => ({
  query: ModelsOfTypeDocument,
  data: {
    pages: {
      edges: models.map(model => ({ node: model })),
    },
  },
});

const pagesPromise = PageFactory.buildList(3);

const meta: Meta<typeof ReasonReferenceModal> = {
  title: "Orders/ReasonReferenceModal",
  component: ReasonReferenceModal,
  decorators: [withApolloMocks(pagesPromise.then(pages => [makeModelsOfTypeMock(pages)]))],
  args: {
    open: true,
    reason: "",
    reasonReference: "",
    referenceModelTypeId: "page-type-1",
    onClose: fn(),
    onConfirm: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof ReasonReferenceModal>;

export const WithReferencePicker: Story = {};

export const WithoutReferencePicker: Story = {
  args: {
    referenceModelTypeId: "",
  },
};

export const Editing: Story = {
  args: {
    reason: "Damaged on arrival",
  },
};
