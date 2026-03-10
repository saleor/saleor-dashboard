import { Meta, StoryObj } from "@storybook/react";
import { Button } from "../Button";
import { Tooltip } from "./index";

const meta: Meta<typeof Tooltip> = {
  title: "Components / Tooltip",
  tags: ["autodocs"],
  component: Tooltip,
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Primary: Story = {
  args: {
    children: [
      // eslint-disable-next-line react/jsx-key
      <Tooltip.Trigger>
        <Button>Left</Button>
      </Tooltip.Trigger>,
      // eslint-disable-next-line react/jsx-key
      <Tooltip.Content side="left">
        Tooltip content
        <Tooltip.Arrow />
      </Tooltip.Content>,
    ],
  },
};

export const RightSide: Story = {
  args: {
    children: [
      // eslint-disable-next-line react/jsx-key
      <Tooltip.Trigger>
        <Button>Right</Button>
      </Tooltip.Trigger>,
      // eslint-disable-next-line react/jsx-key
      <Tooltip.Content side="right">
        Tooltip content
        <Tooltip.Arrow />
      </Tooltip.Content>,
    ],
  },
};

export const Top: Story = {
  args: {
    children: [
      // eslint-disable-next-line react/jsx-key
      <Tooltip.Trigger>
        <Button>Top</Button>
      </Tooltip.Trigger>,
      // eslint-disable-next-line react/jsx-key
      <Tooltip.Content side="top">
        Tooltip content
        <Tooltip.Arrow />
      </Tooltip.Content>,
    ],
  },
};

export const Bottom: Story = {
  args: {
    children: [
      // eslint-disable-next-line react/jsx-key
      <Tooltip.Trigger>
        <Button>Bottom</Button>
      </Tooltip.Trigger>,
      // eslint-disable-next-line react/jsx-key
      <Tooltip.Content side="bottom">
        Tooltip content
        <Tooltip.Arrow />
      </Tooltip.Content>,
    ],
  },
};

export const WithHeading: Story = {
  args: {
    children: [
      // eslint-disable-next-line react/jsx-key
      <Tooltip.Trigger>
        <Button>With heading</Button>
      </Tooltip.Trigger>,
      // eslint-disable-next-line react/jsx-key
      <Tooltip.Content side="left">
        <Tooltip.ContentHeading>Heading</Tooltip.ContentHeading>
        Tooltip content
        <Tooltip.Arrow />
      </Tooltip.Content>,
    ],
  },
};

export const WithoutContent: Story = {
  args: {
    open: true,
    children: [
      // eslint-disable-next-line react/jsx-key
      <Tooltip.Trigger>
        <Button>With heading</Button>
      </Tooltip.Trigger>,
      // eslint-disable-next-line react/jsx-key
      <Tooltip.Content>{null}</Tooltip.Content>,
    ],
  },
};
