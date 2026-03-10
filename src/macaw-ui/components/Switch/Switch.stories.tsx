import { Meta, StoryObj } from "@storybook/react";
import { ProductsIcons, TableEditIcon } from "../Icons";
import { Switch } from "./index";

const meta: Meta<typeof Switch> = {
  title: "Components / Switch",
  tags: ["autodocs"],
  component: Switch,
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Primary: Story = {
  args: {
    defaultValue: "1",
    children: [
      // eslint-disable-next-line react/jsx-key
      <Switch.Item id="1" value="1">
        <TableEditIcon size="medium" />
      </Switch.Item>,
      // eslint-disable-next-line react/jsx-key
      <Switch.Item id="2" value="2">
        <ProductsIcons size="medium" />
      </Switch.Item>,
    ],
  },
};
