import { RichTextContext } from "@dashboard/utils/richText/context";
import { useRichText } from "@dashboard/utils/richText/useRichText";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { ProductDetailsForm } from "./ProductDetailsForm";

const meta: Meta<typeof ProductDetailsForm> = {
  title: "Products / ProductDetailsForm",
  component: ProductDetailsForm,
};

export default meta;

type Story = StoryObj<typeof ProductDetailsForm>;

interface PlaygroundProps {
  rating: number | null;
  withShippingWeight?: boolean;
}

const description = JSON.stringify({
  time: 0,
  blocks: [{ id: "intro", type: "paragraph", data: { text: "A fine bottle of olive oil." } }],
  version: "2.24.3",
});

const ProductDetailsFormPlayground = ({
  rating,
  withShippingWeight = false,
}: PlaygroundProps): React.ReactNode => {
  const [data, setData] = useState({ name: "Olive oil", description: { blocks: [] }, rating });
  const [weight, setWeight] = useState("0.5");
  const richText = useRichText({ initial: description, triggerChange: () => undefined });

  return (
    <RichTextContext.Provider value={richText}>
      <ProductDetailsForm
        data={data}
        shippingWeight={withShippingWeight ? { value: weight } : undefined}
        disabled={false}
        errors={[]}
        onChange={event => {
          if (event.target.name === "weight") {
            setWeight(event.target.value);

            return;
          }

          setData(current => ({ ...current, [event.target.name]: event.target.value }));
        }}
      />
    </RichTextContext.Provider>
  );
};

/** Rating carries a value - the deprecation hint sits under the field. */
export const WithRating: Story = {
  render: () => <ProductDetailsFormPlayground rating={4} />,
};

/** Empty rating, the hint still explains the replacement. */
export const EmptyRating: Story = {
  render: () => <ProductDetailsFormPlayground rating={null} />,
};

/** Simple product: rating sits beside the shipping weight field. */
export const SimpleProductWithShippingWeight: Story = {
  render: () => <ProductDetailsFormPlayground rating={4} withShippingWeight />,
};
