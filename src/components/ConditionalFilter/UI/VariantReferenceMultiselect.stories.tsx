import { Box } from "@saleor/macaw-ui-next";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo, useState } from "react";

import { type FilterEventEmitter } from "./EventEmitter";
import { type MultiselectOperator, type RightOperatorOption } from "./types";
import { VariantReferenceMultiselect } from "./VariantReferenceMultiselect";

const poloThumbnail =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect fill="#c4b5a0" width="40" height="40"/></svg>',
  );
const teeThumbnail =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect fill="#7a8b6f" width="40" height="40"/></svg>',
  );

const options: RightOperatorOption[] = [
  {
    label: "Darko Polo\nM",
    value: "polo-m",
    slug: "polo-m",
    productName: "Darko Polo",
    variantName: "M",
    productThumbnailUrl: poloThumbnail,
  },
  {
    label: "Darko Polo\nS",
    value: "polo-s",
    slug: "polo-s",
    productName: "Darko Polo",
    variantName: "S",
    productThumbnailUrl: poloThumbnail,
  },
  {
    label: "Monospace Tee\n39",
    value: "tee-39",
    slug: "tee-39",
    productName: "Monospace Tee",
    variantName: "39",
    productThumbnailUrl: teeThumbnail,
  },
];

const meta: Meta<typeof VariantReferenceMultiselect> = {
  title: "ConditionalFilter / VariantReferenceMultiselect",
  component: VariantReferenceMultiselect,
};

export default meta;

type Story = StoryObj<typeof VariantReferenceMultiselect>;

const VariantReferenceMultiselectPlayground = (): React.ReactNode => {
  const [value, setValue] = useState<RightOperatorOption[]>([options[0], options[2]]);
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
      <VariantReferenceMultiselect
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
  render: () => <VariantReferenceMultiselectPlayground />,
};
