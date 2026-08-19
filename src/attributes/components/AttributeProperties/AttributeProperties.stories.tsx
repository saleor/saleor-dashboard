import { getAttributePageInitialForm } from "@dashboard/attributes/utils/attributePageForm";
import { AttributeInputTypeEnum, AttributeTypeEnum } from "@dashboard/graphql";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { type AttributePageFormData } from "../AttributePage";
import AttributeProperties from "./AttributeProperties";

const meta: Meta<typeof AttributeProperties> = {
  title: "Attributes / AttributeProperties",
  component: AttributeProperties,
};

export default meta;

type Story = StoryObj<typeof AttributeProperties>;

const AttributePropertiesPlayground = ({
  initial,
}: {
  initial: Partial<AttributePageFormData>;
}): JSX.Element => {
  const [data, setData] = useState<AttributePageFormData>({
    ...getAttributePageInitialForm(),
    ...initial,
  });

  return (
    <AttributeProperties
      data={data}
      disabled={false}
      errors={[]}
      onChange={event =>
        setData(current => ({ ...current, [event.target.name]: event.target.value }))
      }
    />
  );
};

/** Product attribute: storefront filtering is available, and flagged as deprecated. */
export const ProductAttribute: Story = {
  render: () => (
    <AttributePropertiesPlayground
      initial={{
        type: AttributeTypeEnum.PRODUCT_TYPE,
        inputType: AttributeInputTypeEnum.DROPDOWN,
        filterableInStorefront: false,
      }}
    />
  ),
};

/** Storefront filtering on, revealing the nested faceted navigation position. */
export const FacetedNavigationEnabled: Story = {
  render: () => (
    <AttributePropertiesPlayground
      initial={{
        type: AttributeTypeEnum.PRODUCT_TYPE,
        inputType: AttributeInputTypeEnum.DROPDOWN,
        filterableInStorefront: true,
        storefrontSearchPosition: "2",
      }}
    />
  ),
};

/** Model attribute: no storefront filtering settings at all. */
export const ModelAttribute: Story = {
  render: () => <AttributePropertiesPlayground initial={{ type: AttributeTypeEnum.PAGE_TYPE }} />,
};
