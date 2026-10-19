import { getAttributePageInitialForm } from "@dashboard/attributes/utils/attributePageForm";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { type AttributePageFormData } from "../AttributePage/AttributePage";
import AttributeDetails from "./AttributeDetails";

const meta: Meta<typeof AttributeDetails> = {
  title: "Attributes / AttributeDetails",
  component: AttributeDetails,
};

export default meta;

type Story = StoryObj<typeof AttributeDetails>;

const noop = (): void => undefined;

const AttributeDetailsPlayground = ({
  initial,
}: {
  initial: Partial<AttributePageFormData>;
}): React.ReactNode => {
  const [data, setData] = useState<AttributePageFormData>({
    ...getAttributePageInitialForm(),
    name: "Fabric weight",
    slug: "fabric-weight",
    ...initial,
  });

  return (
    <AttributeDetails
      apiErrors={[]}
      canChangeType={false}
      clearErrors={noop}
      data={data}
      disabled={false}
      errors={{}}
      setError={noop}
      onChange={event =>
        setData(current => ({ ...current, [event.target.name]: event.target.value }))
      }
      onUnitChange={noop}
    />
  );
};

export const EmptyInternalDescription: Story = {
  render: () => <AttributeDetailsPlayground initial={{}} />,
};

export const WithInternalDescription: Story = {
  render: () => (
    <AttributeDetailsPlayground
      initial={{
        internalDescription:
          "Weight of one square meter of fabric, in grams.\nRound to whole numbers. Leave empty for knitwear.",
      }}
    />
  ),
};
