import { Meta, StoryObj } from "@storybook/react";
import { Button } from "../Button";
import { MenuIcon } from "../Icons";
import { Text } from "../Text";
import { Drawer } from "./index";

const meta: Meta<typeof Drawer> = {
  title: "Components / Drawer",
  tags: ["autodocs"],
  component: Drawer,
};

export default meta;
type Story = StoryObj<typeof Drawer>;

export const Primary: Story = {
  args: {
    children: [
      // eslint-disable-next-line react/jsx-key
      <Drawer.Trigger>
        <Button variant="tertiary" icon={<MenuIcon />} />
      </Drawer.Trigger>,
      // eslint-disable-next-line react/jsx-key
      <Drawer.Content paddingLeft={2} paddingRight={2}>
        <Text>Drawer content!</Text>
      </Drawer.Content>,
    ],
  },
};
