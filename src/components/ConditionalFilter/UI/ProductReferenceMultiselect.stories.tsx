import { Box } from "@saleor/macaw-ui-next";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo, useState } from "react";

import { type FilterEventEmitter } from "./EventEmitter";
import { ProductReferenceMultiselect } from "./ProductReferenceMultiselect";
import { type MultiselectOperator, type RightOperatorOption } from "./types";

const appleThumbnail =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect fill="#c45c26" width="40" height="40"/></svg>',
  );
const hoodieThumbnail =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect fill="#3d6b4f" width="40" height="40"/></svg>',
  );

const options: RightOperatorOption[] = [
  {
    label: "Apple Juice",
    value: "apple",
    slug: "apple-juice",
    productThumbnailUrl: appleThumbnail,
  },
  {
    label: "Alpine Oversized Hoodie",
    value: "hoodie",
    slug: "alpine-hoodie",
    productThumbnailUrl: hoodieThumbnail,
  },
  {
    label: "Monospace Tee Lorem ipsum Very Long So I Can Test It",
    value: "tee",
    slug: "monospace-tee",
  },
];

const meta: Meta<typeof ProductReferenceMultiselect> = {
  title: "ConditionalFilter / ProductReferenceMultiselect",
  component: ProductReferenceMultiselect,
};

export default meta;

type Story = StoryObj<typeof ProductReferenceMultiselect>;

const ProductReferenceMultiselectPlayground = (): React.ReactNode => {
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
      <ProductReferenceMultiselect
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
  render: () => <ProductReferenceMultiselectPlayground />,
};
