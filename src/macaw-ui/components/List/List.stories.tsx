import { Meta, StoryObj } from "@storybook/react";
import { Box } from "../Box";
import { Text } from "../Text";
import { List } from "./index";

const meta: Meta<typeof List> = {
  title: "Components / List",
  tags: ["autodocs"],
  component: List,
};

export default meta;
type Story = StoryObj<typeof List>;

export const Primary: Story = {
  args: {
    children: [
      // eslint-disable-next-line react/jsx-key
      <List.Item paddingX={2} paddingY={2} gap={3} borderRadius={3}>
        <Text>List item</Text>
      </List.Item>,
    ],
  },
};

export const Disabled: Story = {
  args: {
    children: [
      // eslint-disable-next-line react/jsx-key
      <List.Item paddingX={2} paddingY={2} gap={3} borderRadius={3} disabled>
        <Text>List item</Text>
      </List.Item>,
    ],
  },
};

export const Active: Story = {
  args: {
    children: [
      // eslint-disable-next-line react/jsx-key
      <List.Item paddingX={2} paddingY={2} gap={3} borderRadius={3} active>
        <Text>List item</Text>
      </List.Item>,
    ],
  },
};

export const Group: Story = {
  args: {
    children: [
      // eslint-disable-next-line react/jsx-key
      <List.ItemGroup>
        <List.ItemGroup.Trigger size="medium">
          <Text>Trigger</Text>
        </List.ItemGroup.Trigger>
        <List.ItemGroup.Content>
          <Box>
            <List.Item paddingX={2} paddingY={2} gap={3} borderRadius={3}>
              <Text>Item 1</Text>
            </List.Item>
            <List.Item paddingX={2} paddingY={2} gap={3} borderRadius={3}>
              <Text>Item 2</Text>
            </List.Item>
          </Box>
        </List.ItemGroup.Content>
      </List.ItemGroup>,
    ],
  },
};
