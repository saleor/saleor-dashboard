import { AttributeInputTypeEnum } from "@dashboard/graphql";
import { Box, Input } from "@saleor/macaw-ui-next";
import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";

import { ATTRIBUTE_DESCRIPTION_COLLAPSED_STORAGE_KEY } from "./attributeDescriptionCollapse";
import { AttributeRowChromeContext } from "./attributeRowChrome";
import { BasicAttributeRow } from "./BasicAttributeRow";

const ATTRIBUTE_ID = "fabric-weight";

const meta: Meta<typeof BasicAttributeRow> = {
  title: "Components / Attributes / BasicAttributeRow",
  component: BasicAttributeRow,
  args: {
    attributeId: ATTRIBUTE_ID,
    id: "fabric-weight-input",
    inputType: AttributeInputTypeEnum.NUMERIC,
    label: "Fabric weight",
    internalDescription:
      "Weight of one square meter of fabric, in grams.\nRound to whole numbers. Leave empty for knitwear.",
    children: <Input id="fabric-weight-input" size="small" value="180" />,
  },
  decorators: [
    (Story: StoryFn) => (
      <AttributeRowChromeContext.Provider value="card">
        <Box as="ul" __maxWidth="720px">
          <Story />
        </Box>
      </AttributeRowChromeContext.Provider>
    ),
  ],
  beforeEach: () => {
    window.localStorage.removeItem(ATTRIBUTE_DESCRIPTION_COLLAPSED_STORAGE_KEY);
  },
};

export default meta;
type Story = StoryObj<typeof BasicAttributeRow>;

export const DescriptionExpanded: Story = {};

export const DescriptionCollapsed: Story = {
  beforeEach: () => {
    window.localStorage.setItem(
      ATTRIBUTE_DESCRIPTION_COLLAPSED_STORAGE_KEY,
      JSON.stringify([ATTRIBUTE_ID]),
    );
  },
};

export const WithoutDescription: Story = {
  args: {
    internalDescription: null,
  },
};
