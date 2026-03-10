/* eslint-disable react/jsx-key */
import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Box, Button, Text } from "../..";

import { Accordion } from ".";

const meta: Meta<typeof Accordion> = {
  title: "Components / Accordion",
  tags: ["autodocs"],
  component: Accordion,
};

export default meta;
type Story = StoryObj<typeof Accordion>;

const args: Story["args"] = {
  defaultValue: "first-item",
  display: "flex",
  gap: 2,
  flexDirection: "column",
  children: [
    <Accordion.Item value="first-item">
      <Accordion.Trigger>
        <Text>Trigger 1</Text>
        <Accordion.TriggerButton />
      </Accordion.Trigger>
      <Accordion.Content>Content 1</Accordion.Content>
    </Accordion.Item>,
    <Accordion.Item value="second-item">
      <Accordion.Trigger>
        <Text>Trigger 2</Text>
        <Accordion.TriggerButton />
      </Accordion.Trigger>
      <Accordion.Content>Content 2</Accordion.Content>
    </Accordion.Item>,
    <Accordion.Item value="third-item">
      <Accordion.Trigger disabled>
        <Text color="defaultDisabled">Trigger 3</Text>
        <Accordion.TriggerButton disabled />
      </Accordion.Trigger>
      <Accordion.Content>Content 3</Accordion.Content>
    </Accordion.Item>,
  ],
};

export const Primary: Story = {
  args,
};

export const Controlled: Story = {
  args,
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState<undefined | string>(
      args.defaultValue as string
    );

    return (
      <Box>
        <Box display="flex" gap={5} marginBottom={10}>
          <Button variant="secondary" onClick={() => setValue("first-item")}>
            Open first
          </Button>
          <Button variant="secondary" onClick={() => setValue("second-item")}>
            Open second
          </Button>
          <Button variant="secondary" onClick={() => setValue("third-item")}>
            Open third
          </Button>
        </Box>
        <Accordion
          {...args}
          type="single"
          defaultValue={args.defaultValue as string | undefined}
          value={value}
          onValueChange={(value: string) => setValue(value)}
        />
      </Box>
    );
  },
};

export const WithTriggerButtonOnLeft: Story = {
  args: {
    ...args,
    children: [
      <Accordion.Item value="first-item">
        <Accordion.Trigger>
          <Accordion.TriggerButton />
          <Text>Trigger 1</Text>
        </Accordion.Trigger>
        <Accordion.Content>Content 1</Accordion.Content>
      </Accordion.Item>,
      <Accordion.Item value="second-item">
        <Accordion.Trigger>
          <Accordion.TriggerButton />
          <Text>Trigger 2</Text>
        </Accordion.Trigger>
        <Accordion.Content>Content 2</Accordion.Content>
      </Accordion.Item>,
      <Accordion.Item value="third-item">
        <Accordion.Trigger disabled>
          <Accordion.TriggerButton disabled />
          <Text color="defaultDisabled">Trigger 3</Text>
        </Accordion.Trigger>
        <Accordion.Content>Content 3</Accordion.Content>
      </Accordion.Item>,
    ],
  },
};

export const WithoutTriggerButton: Story = {
  args: {
    ...args,
    children: [
      <Accordion.Item value="first-item">
        <Accordion.Trigger>
          <Text>Trigger 1</Text>
        </Accordion.Trigger>
        <Accordion.Content>Content 1</Accordion.Content>
      </Accordion.Item>,
      <Accordion.Item value="second-item">
        <Accordion.Trigger>
          <Text>Trigger 2</Text>
        </Accordion.Trigger>
        <Accordion.Content>Content 2</Accordion.Content>
      </Accordion.Item>,
      <Accordion.Item value="third-item">
        <Accordion.Trigger disabled>
          <Text color="defaultDisabled">Trigger 3</Text>
        </Accordion.Trigger>
        <Accordion.Content>Content 3</Accordion.Content>
      </Accordion.Item>,
    ],
  },
};

export const Multiple: Story = {
  args: {
    ...args,
    onValueChange: undefined,
    value: undefined,
    type: "multiple",
    defaultValue: ["first-item", "second-item"],
    children: [
      <Accordion.Item value="first-item">
        <Accordion.Trigger>
          <Text>Trigger 1</Text>
          <Accordion.TriggerButton />
        </Accordion.Trigger>
        <Accordion.Content>Content 1</Accordion.Content>
      </Accordion.Item>,
      <Accordion.Item value="second-item">
        <Accordion.Trigger>
          <Text>Trigger 2</Text>
          <Accordion.TriggerButton />
        </Accordion.Trigger>
        <Accordion.Content>Content 2</Accordion.Content>
      </Accordion.Item>,
      <Accordion.Item value="third-item">
        <Accordion.Trigger disabled>
          <Text color="defaultDisabled">Trigger 3</Text>
          <Accordion.TriggerButton disabled />
        </Accordion.Trigger>
        <Accordion.Content>Content 3</Accordion.Content>
      </Accordion.Item>,
    ],
  },
};
