import { AttributeInputTypeEnum } from "@dashboard/graphql";
import { type RichTextGetters } from "@dashboard/utils/richText/useMultipleRichText";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { type AttributeInput, Attributes } from "./Attributes";

const plainTextAttribute = (id: string, label: string, value: string): AttributeInput => ({
  data: {
    inputType: AttributeInputTypeEnum.PLAIN_TEXT,
    isRequired: false,
    values: [],
    selectedValues: [],
  },
  id,
  label,
  value: [value],
});

const PLAIN_TEXT_ATTRIBUTES: AttributeInput[] = [
  plainTextAttribute("color", "Color", "#2563eb"),
  plainTextAttribute("accent", "Accent color", "#fafafa"),
  plainTextAttribute("manual", "Manual", "https://docs.saleor.io"),
  plainTextAttribute("material", "Material", "Cotton, 100%"),
];

const richTextGetters: RichTextGetters<string> = {
  getDefaultValue: () => ({ blocks: [] }),
  getHandleChange: () => () => undefined,
  getMountEditor: () => () => undefined,
  getShouldMount: () => false,
};

const noop = (): void => undefined;

const PlainTextAttributes = ({ chrome }: { chrome: "legacy" | "card" }): React.ReactNode => {
  const [attributes, setAttributes] = useState(PLAIN_TEXT_ATTRIBUTES);

  return (
    <Attributes
      attributes={attributes}
      attributeValues={[]}
      errors={[]}
      chrome={chrome}
      disabled={false}
      loading={false}
      referenceLayoutView="product"
      richTextGetters={richTextGetters}
      onChange={(id, value) =>
        setAttributes(current =>
          current.map(attribute =>
            attribute.id === id ? { ...attribute, value: [String(value)] } : attribute,
          ),
        )
      }
      onAttributeSelectBlur={noop}
      onFileChange={noop}
      onMultiChange={noop}
      onReferencesAddClick={noop}
      onReferencesRemove={noop}
      onReferencesReorder={noop}
      fetchAttributeValues={noop}
      fetchMoreAttributeValues={{ hasMore: false, loading: false, onFetchMore: noop }}
    />
  );
};

const meta: Meta<typeof PlainTextAttributes> = {
  title: "Components / Attributes",
  component: PlainTextAttributes,
  args: {
    chrome: "card",
  },
  argTypes: {
    chrome: {
      control: "inline-radio",
      options: ["card", "legacy"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof PlainTextAttributes>;

export const PlainTextValues: Story = {};
