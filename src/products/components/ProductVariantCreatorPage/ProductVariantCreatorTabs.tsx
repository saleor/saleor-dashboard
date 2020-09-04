import makeCreatorSteps, { Step } from "@saleor/components/CreatorSteps";
import React from "react";
import { useIntl } from "react-intl";

import { ProductVariantCreatorStep } from "./types";

function useSteps(): Array<Step<ProductVariantCreatorStep>> {
  const intl = useIntl();

  return [
    {
      label: intl.formatMessage({
        defaultMessage: "Choose attributes",
        description: "attributes list, variant creation step"
      }),
      value: ProductVariantCreatorStep.attributes
    },
    {
      label: intl.formatMessage({
        defaultMessage: "Select Values",
        description: "attribute values, variant creation step"
      }),
      value: ProductVariantCreatorStep.values
    },
    {
      label: intl.formatMessage({
        defaultMessage: "Prices and SKU",
        description: "variant creation step"
      }),
      value: ProductVariantCreatorStep.prices
    },
    {
      label: intl.formatMessage({
        defaultMessage: "Summary",
        description: "variant creation step"
      }),
      value: ProductVariantCreatorStep.summary
    }
  ];
}

const ProductVariantCreatorSteps = makeCreatorSteps<
  ProductVariantCreatorStep
>();

export interface ProductVariantCreatorTabsProps {
  step: ProductVariantCreatorStep;
  onStepClick: (step: ProductVariantCreatorStep) => void;
}

const ProductVariantCreatorTabs: React.FC<ProductVariantCreatorTabsProps> = ({
  step: currentStep,
  onStepClick
}) => {
  const steps = useSteps();

  return (
    <ProductVariantCreatorSteps
      currentStep={currentStep}
      steps={steps}
      onStepClick={onStepClick}
    />
  );
};

ProductVariantCreatorTabs.displayName = "ProductVariantCreatorTabs";
export default ProductVariantCreatorTabs;
