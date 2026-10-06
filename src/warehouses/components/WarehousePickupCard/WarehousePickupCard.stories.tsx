import { WarehouseClickAndCollectOptionEnum } from "@dashboard/graphql";
import { Box } from "@saleor/macaw-ui-next";
import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";

import { WarehousePickupCard } from "./WarehousePickupCard";

const meta: Meta<typeof WarehousePickupCard> = {
  title: "Warehouses / WarehousePickupCard",
  component: WarehousePickupCard,
  decorators: [
    (Story: StoryFn) => (
      <Box __maxWidth="720px" padding={4}>
        <Story />
      </Box>
    ),
  ],
  args: {
    clickAndCollectOption: WarehouseClickAndCollectOptionEnum.DISABLED,
    disabled: false,
    onOptionChange: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof WarehousePickupCard>;

export const Off: Story = {};

export const On: Story = {
  args: {
    clickAndCollectOption: WarehouseClickAndCollectOptionEnum.LOCAL,
  },
};

export const Interactive: Story = {
  render: () => {
    const [option, setOption] = useState(WarehouseClickAndCollectOptionEnum.DISABLED);

    return (
      <WarehousePickupCard
        clickAndCollectOption={option}
        disabled={false}
        onOptionChange={setOption}
      />
    );
  },
};
