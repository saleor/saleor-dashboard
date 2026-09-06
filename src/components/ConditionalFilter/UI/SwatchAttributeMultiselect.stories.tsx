import { Box } from "@saleor/macaw-ui-next";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo, useState } from "react";

import { type FilterEventEmitter } from "./EventEmitter";
import { SwatchAttributeMultiselect } from "./SwatchAttributeMultiselect";
import { type MultiselectOperator, type RightOperatorOption } from "./types";

const plaidSwatch =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect fill="#3d6b4f" width="20" height="20"/><rect fill="#c45c26" x="20" width="20" height="20"/><rect fill="#c45c26" y="20" width="20" height="20"/><rect fill="#3d6b4f" x="20" y="20" width="20" height="20"/></svg>',
  );

const options: RightOperatorOption[] = [
  {
    label: "Dark Orange",
    value: "orange",
    slug: "dark-orange",
    swatchColor: "#c45c26",
  },
  {
    label: "Teal",
    value: "teal",
    slug: "teal",
    swatchColor: "#0d7377",
  },
  {
    label: "Plaid",
    value: "plaid",
    slug: "plaid",
    swatchFileUrl: plaidSwatch,
  },
];

const meta: Meta<typeof SwatchAttributeMultiselect> = {
  title: "ConditionalFilter / SwatchAttributeMultiselect",
  component: SwatchAttributeMultiselect,
};

export default meta;

type Story = StoryObj<typeof SwatchAttributeMultiselect>;

const SwatchAttributeMultiselectPlayground = (): React.ReactNode => {
  const [value, setValue] = useState<RightOperatorOption[]>([options[0]]);
  const selected: MultiselectOperator = {
    conditionValue: { type: "multiselect", label: "in", value: "input-2" },
    loading: false,
    value,
    options,
  };
  const emitter = useMemo(
    () =>
      ({
        changeRightOperator: (_index: number, next: RightOperatorOption[]) => setValue(next),
        inputChangeRightOperator: () => undefined,
        focusRightOperator: () => undefined,
        blurRightOperator: () => undefined,
        scrollEndRightOperator: () => undefined,
      }) as unknown as FilterEventEmitter,
    [],
  );

  return (
    <Box __width="360px">
      <SwatchAttributeMultiselect
        index={0}
        selected={selected}
        emitter={emitter}
        error={false}
        helperText=""
        disabled={false}
      />
    </Box>
  );
};

export const Default: Story = {
  render: () => <SwatchAttributeMultiselectPlayground />,
};
