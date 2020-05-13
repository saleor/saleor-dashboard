import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Container from "@saleor/components/Container";
import Hr from "@saleor/components/Hr";
import PageHeader from "@saleor/components/PageHeader";
import useWizard from "@saleor/hooks/useWizard";
import React from "react";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";

import { ProductVariantBulkCreateInput } from "../../../types/globalTypes";
import { createInitialForm, ProductVariantCreateFormData } from "./form";
import ProductVariantCreatorContent, {
  ProductVariantCreatorContentProps
} from "./ProductVariantCreatorContent";
import ProductVariantCreateTabs from "./ProductVariantCreatorTabs";
import reduceProductVariantCreateFormData, {
  ProductVariantCreateReducerActionType
} from "./reducer";
import { ProductVariantCreatorStep } from "./types";

const useStyles = makeStyles(
  theme => ({
    button: {
      marginLeft: theme.spacing(2)
    },
    content: {
      overflowX: "visible",
      overflowY: "hidden",
      width: 800
    },
    description: {
      marginTop: theme.spacing()
    },
    hr: {
      margin: theme.spacing(3, 0)
    }
  }),
  { name: "ProductVariantCreatePage" }
);

function canHitNext(
  step: ProductVariantCreatorStep,
  data: ProductVariantCreateFormData
): boolean {
  switch (step) {
    case ProductVariantCreatorStep.values:
      return data.attributes.every(attribute => attribute.values.length > 0);
    case ProductVariantCreatorStep.prices:
      if (data.price.mode === "all") {
        if (data.price.value === "") {
          return false;
        }
      } else if (data.price.mode === "attribute") {
        if (
          data.price.attribute === "" ||
          data.price.values.some(attributeValue => attributeValue.value === "")
        ) {
          return false;
        }
      }

      if (data.stock.mode === "attribute" && data.stock.attribute === "") {
        return false;
      }

      return true;
    case ProductVariantCreatorStep.summary:
      return data.variants.every(variant => variant.sku !== "");

    default:
      return false;
  }
}

export interface ProductVariantCreatePageProps
  extends Omit<
    ProductVariantCreatorContentProps,
    "data" | "dispatchFormDataAction" | "step" | "onStepClick"
  > {
  defaultPrice: string;
  onSubmit: (data: ProductVariantBulkCreateInput[]) => void;
}

function getTitle(step: ProductVariantCreatorStep, intl: IntlShape): string {
  switch (step) {
    case ProductVariantCreatorStep.values:
      return intl.formatMessage({
        defaultMessage: "Choose Values",
        description: "product attribute values, page title"
      });
    case ProductVariantCreatorStep.prices:
      return intl.formatMessage({
        defaultMessage: "Price and SKUs",
        description: "page title"
      });
    case ProductVariantCreatorStep.summary:
      return intl.formatMessage({
        defaultMessage: "Summary",
        description: "page title"
      });
  }
}

function getDescription(
  step: ProductVariantCreatorStep,
  intl: IntlShape
): string {
  switch (step) {
    case ProductVariantCreatorStep.values:
      return intl.formatMessage({
        defaultMessage:
          "Selected values will be used to create variants for the configurable product."
      });
    case ProductVariantCreatorStep.prices:
      return intl.formatMessage({
        defaultMessage:
          "Based on your selections we will create 8 products. Use this step to customize price and stocks for your new products."
      });
    case ProductVariantCreatorStep.summary:
      return intl.formatMessage({
        defaultMessage:
          "Here is the summary of variants that will be created. You can change prices, stocks an SKU for each one created."
      });
  }
}

const ProductVariantCreatePage: React.FC<ProductVariantCreatePageProps> = props => {
  const {
    attributes,
    defaultPrice,
    errors,
    onSubmit,
    warehouses,
    ...contentProps
  } = props;
  const classes = useStyles(props);
  const intl = useIntl();
  const [wizardData, dispatchFormDataAction] = React.useReducer(
    reduceProductVariantCreateFormData,
    createInitialForm(attributes, defaultPrice, warehouses)
  );
  const [step, { next: nextStep, prev: prevStep, set: setStep }] = useWizard<
    ProductVariantCreatorStep
  >(
    ProductVariantCreatorStep.values,
    [
      ProductVariantCreatorStep.values,
      ProductVariantCreatorStep.prices,
      ProductVariantCreatorStep.summary
    ],
    {
      onTransition: (_, nextStep) => {
        if (nextStep === ProductVariantCreatorStep.summary) {
          dispatchFormDataAction({
            type: ProductVariantCreateReducerActionType.reload
          });
        }
      }
    }
  );
  const reloadForm = () =>
    dispatchFormDataAction({
      reload: {
        data: createInitialForm(attributes, defaultPrice, warehouses)
      },
      type: ProductVariantCreateReducerActionType.reload
    });

  React.useEffect(reloadForm, [attributes.length, warehouses.length]);

  return (
    <Container>
      <ProductVariantCreateTabs step={step} onStepClick={setStep} />
      <PageHeader
        title={
          <>
            {getTitle(step, intl)}
            <Typography className={classes.description} variant="body2">
              {getDescription(step, intl)}
            </Typography>
          </>
        }
      >
        {step !== ProductVariantCreatorStep.values && (
          <Button className={classes.button} color="primary" onClick={prevStep}>
            <FormattedMessage
              defaultMessage="Previous"
              description="previous step, button"
            />
          </Button>
        )}
        {step !== ProductVariantCreatorStep.summary ? (
          <Button
            className={classes.button}
            color="primary"
            disabled={!canHitNext(step, wizardData)}
            variant="contained"
            onClick={nextStep}
          >
            <FormattedMessage defaultMessage="Next" description="button" />
          </Button>
        ) : (
          <Button
            className={classes.button}
            color="primary"
            disabled={!canHitNext(step, wizardData)}
            variant="contained"
            onClick={() => onSubmit(wizardData.variants)}
          >
            <FormattedMessage
              defaultMessage="Create"
              description="create multiple variants, button"
            />
          </Button>
        )}
      </PageHeader>
      <Hr className={classes.hr} />
      <ProductVariantCreatorContent
        {...contentProps}
        attributes={attributes}
        data={wizardData}
        dispatchFormDataAction={dispatchFormDataAction}
        errors={errors}
        step={step}
        warehouses={warehouses}
      />
    </Container>
  );
};

ProductVariantCreatePage.displayName = "ProductVariantCreatePage";
export default ProductVariantCreatePage;
