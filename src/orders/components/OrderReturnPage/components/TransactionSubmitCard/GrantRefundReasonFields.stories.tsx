import { ModelsOfTypeDocument } from "@dashboard/graphql";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type MockResponse, withApolloMocks } from "@storybookUtils/apollo";
import { PageFactory } from "@storybookUtils/AssignDialogShared/factories";
import { fn } from "storybook/test";

import { GrantRefundReasonFields } from "./GrantRefundReasonFields";

const makeModelsOfTypeMock = (models: Array<{ id: string; title: string }>): MockResponse => ({
  query: ModelsOfTypeDocument,
  data: {
    pages: {
      edges: models.map(model => ({ node: model })),
    },
  },
});

const pagesPromise = PageFactory.buildList(3);

const meta: Meta<typeof GrantRefundReasonFields> = {
  title: "Orders/GrantRefundReasonFields",
  component: GrantRefundReasonFields,
  decorators: [withApolloMocks(pagesPromise.then(pages => [makeModelsOfTypeMock(pages)]))],
  args: {
    refundReason: "",
    refundReasonReference: "",
    refundReasonReferenceTypeId: "page-type-1",
    disabled: false,
    onChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof GrantRefundReasonFields>;

export const WithStructuredReason: Story = {};

export const FreeTextOnly: Story = {
  args: {
    refundReasonReferenceTypeId: "",
    refundReason: "Customer changed their mind",
  },
};
