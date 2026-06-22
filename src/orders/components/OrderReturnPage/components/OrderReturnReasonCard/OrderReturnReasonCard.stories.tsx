import { ModelsOfTypeDocument } from "@dashboard/graphql";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type MockResponse, withApolloMocks } from "@storybookUtils/apollo";
import { PageFactory } from "@storybookUtils/AssignDialogShared/factories";
import { fn } from "storybook/test";

import { OrderReturnReasonCard } from "./OrderReturnReasonCard";

const makeModelsOfTypeMock = (models: Array<{ id: string; title: string }>): MockResponse => ({
  query: ModelsOfTypeDocument,
  data: {
    pages: {
      edges: models.map(model => ({ node: model })),
    },
  },
});

const pagesPromise = PageFactory.buildList(3);

const meta: Meta<typeof OrderReturnReasonCard> = {
  title: "Orders/OrderReturnReasonCard",
  component: OrderReturnReasonCard,
  decorators: [withApolloMocks(pagesPromise.then(pages => [makeModelsOfTypeMock(pages)]))],
  args: {
    reason: "",
    reasonReference: "",
    reasonReferenceTypeId: "page-type-1",
    disabled: false,
    onChangeReason: fn(),
    onChangeReasonReference: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof OrderReturnReasonCard>;

export const WithStructuredReason: Story = {};

export const Errored: Story = {
  args: {
    error: true,
  },
};

export const NotConfiguredDisabled: Story = {
  args: {
    reasonReferenceTypeId: "",
    reason: "Customer changed their mind",
  },
};
