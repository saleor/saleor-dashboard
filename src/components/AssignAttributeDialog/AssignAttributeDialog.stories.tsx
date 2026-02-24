import type { Meta, StoryObj } from "@storybook/react-vite";
import { AttributeFactory } from "@storybookUtils/AssignDialogShared/factories";
import type { ComponentProps } from "react";
import { useRef } from "react";
import { fn } from "storybook/test";

import AssignAttributeDialog from "./AssignAttributeDialog";

type Props = ComponentProps<typeof AssignAttributeDialog>;

const meta: Meta<typeof AssignAttributeDialog> = {
  title: "Components/Dialogs/AssignAttributeDialog",
  component: AssignAttributeDialog,
  loaders: [async () => ({ attributes: await AttributeFactory.buildList(6) })],
  render: (args: Props, { loaded }: { loaded: { attributes: Props["attributes"] } }) => {
    const onFetchRef = useRef(args.onFetch);

    onFetchRef.current = args.onFetch;

    const stableOnFetch = useRef((query: string) => {
      setTimeout(() => onFetchRef.current?.(query), 0);
    });

    return (
      <AssignAttributeDialog
        {...args}
        attributes={args.attributes ?? loaded.attributes}
        onFetch={stableOnFetch.current}
      />
    );
  },
  argTypes: {
    confirmButtonState: {
      control: "inline-radio",
      options: ["default", "loading", "success", "error"],
    },
    onClose: { table: { disable: true } },
    onFetch: { table: { disable: true } },
    onFetchMore: { table: { disable: true } },
    onOpen: { table: { disable: true } },
    onSubmit: { table: { disable: true } },
    onToggle: { table: { disable: true } },
    attributes: { table: { disable: true } },
    selected: { table: { disable: true } },
    errors: { table: { disable: true } },
  },
  args: {
    open: true,
    loading: false,
    hasMore: false,
    confirmButtonState: "default",
    errors: [],
    selected: [],
    onClose: fn(),
    onFetch: fn(),
    onFetchMore: fn(),
    onOpen: fn(),
    onSubmit: fn(),
    onToggle: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof AssignAttributeDialog>;

export const Default: Story = {};

export const Loading: Story = {
  args: { loading: true, attributes: [] },
};

export const Empty: Story = {
  args: { attributes: [] },
};
