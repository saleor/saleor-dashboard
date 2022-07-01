import { Typography } from "@material-ui/core";
import { Button } from "@saleor/components/Button";
import Container from "@saleor/components/Container";
import Hr from "@saleor/components/Hr";
import PageHeader from "@saleor/components/PageHeader";
import {
  ProductVariantBulkCreateInput,
  RefreshLimitsQuery,
} from "@saleor/graphql";
import { SubmitPromise } from "@saleor/hooks/useForm";
import useWizard from "@saleor/hooks/useWizard";
import { makeStyles } from "@saleor/macaw-ui";
import { validatePrice } from "@saleor/products/utils/validation";
import React from "react";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";

import { createInitialForm, ProductVariantCreateFormData } from "./form";
import ProductVariantCreatorContent, {
  ProductVariantCreatorContentProps,
} from "./ProductVariantCreatorContent";
import ProductVariantCreateTabs from "./ProductVariantCreatorTabs";
import { getVariantsNumber } from "./ProductVariantCreatorValues";
import reduceProductVariantCreateFormData, {
  ProductVariantCreateReducerActionType,
} from "./reducer";
import { ProductVariantCreatorStep } from "./types";
import { dedupeListings } from "./utils";

const useStyles = makeStyles(
  theme => ({
    button: {
      marginLeft: theme.spacing(2),
    },
    content: {
      overflowX: "visible",
    },
    description: {
      marginTop: theme.spacing(),
    },
    hr: {
      margin: theme.spacing(3, 0),
    },
  }),
  { name: "ProductVariantCreatePage" },
);

function canHitNext(
  step: ProductVariantCreatorStep,
  data: ProductVariantCreateFormData,
  variantsLeft: number | null,
): boolean {
  switch (step) {
    case ProductVariantCreatorStep.values:
      return (
        data.attributes.every(
          attribute => !attribute.valueRequired || attribute.values.length > 0,
        ) &&
        (variantsLeft === null || getVariantsNumber(data) <= variantsLeft)
      );
    case ProductVariantCreatorStep.prices:
      if (data.price.mode === "all") {
        if (data.price.channels.some(channel => validatePrice(channel.price))) {
          return false;
        }
      } else if (data.price.mode === "attribute") {
        if (
          !data.price.attribute ||
          data.price.values.some(
            attribute =>
              attribute.value.length < data.price.channels.length ||
              attribute.value.some(channel => validatePrice(channel.price)),
          )
        ) {
          return false;
        }
      }

      if (data.stock.mode === "attribute" && data.stock.attribute === "") {
        return false;
      }

      return true;
    case ProductVariantCreatorStep.summary:
      return !data.variants.some(variant =>
        variant.channelListings.some(channel => validatePrice(channel.price)),
      );

    default:
      return false;
  }
}

export interface ProductVariantCreatePageProps
  extends Omit<
    ProductVariantCreatorContentProps,
    "data" | "dispatchFormDataAction" | "step" | "variantsLeft" | "onStepClick"
  > {
  limits: RefreshLimitsQuery["shop"]["limits"];
  onSubmit: (data: ProductVariantBulkCreateInput[]) => SubmitPromise;
}

function getTitle(step: ProductVariantCreatorStep, intl: IntlShape): string {
  switch (step) {
    case ProductVariantCreatorStep.values:
      return intl.formatMessage({
        id: "NXpFlL",
        defaultMessage: "Choose Values",
        description: "product attribute values, page title",
      });
    case ProductVariantCreatorStep.prices:
      return intl.formatMessage({
        id: "7WEC+G",
        defaultMessage: "Price and SKUs",
        description: "page title",
      });
    case ProductVariantCreatorStep.summary:
      return intl.formatMessage({
        id: "g1WQlC",
        defaultMessage: "Summary",
        description: "page title",
      });
  }
}

function getDescription(
  step: ProductVariantCreatorStep,
  intl: IntlShape,
): string {
  switch (step) {
    case ProductVariantCreatorStep.values:
      return intl.formatMessage({
        id: "ClFzoD",
        defaultMessage:
          "Selected values will be used to create variants for the configurable product.",
      });
    case ProductVariantCreatorStep.prices:
      return intl.formatMessage({
        id: "iigydN",
        defaultMessage:
          "Based on your selections we will create 8 products. Use this step to customize price and stocks for your new products.",
      });
    case ProductVariantCreatorStep.summary:
      return intl.formatMessage({
        id: "rHXF43",
        defaultMessage:
          "Here is the summary of variants that will be created. You can change prices, stocks an SKU for each one created.",
      });
  }
}

const ProductVariantCreatePage: React.FC<ProductVariantCreatePageProps> = props => {
  const {
    attributes,
    channelListings,
    errors,
    limits,
    onSubmit,
    warehouses,
    ...contentProps
  } = props;
  const classes = useStyles(props);
  const intl = useIntl();
  const [wizardData, dispatchFormDataAction] = React.useReducer(
    reduceProductVariantCreateFormData,
    createInitialForm(attributes, channelListings, warehouses),
  );
  const [step, { next: nextStep, prev: prevStep, set: setStep }] = useWizard<
    ProductVariantCreatorStep
  >(
    ProductVariantCreatorStep.values,
    [
      ProductVariantCreatorStep.values,
      ProductVariantCreatorStep.prices,
      ProductVariantCreatorStep.summary,
    ],
    {
      onTransition: (_, nextStep) => {
        if (nextStep === ProductVariantCreatorStep.summary) {
          dispatchFormDataAction({
            type: ProductVariantCreateReducerActionType.rebuild,
          });
        }
      },
    },
  );
  const reloadForm = () =>
    dispatchFormDataAction({
      reload: {
        data: createInitialForm(attributes, channelListings, warehouses),
      },
      type: ProductVariantCreateReducerActionType.reload,
    });

  React.useEffect(reloadForm, [attributes.length, warehouses.length]);

  const variantsLeft = limits?.allowedUsage.productVariants
    ? limits.allowedUsage.productVariants - limits.currentUsage.productVariants
    : null;

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
          <Button className={classes.button} onClick={prevStep}>
            <FormattedMessage
              id="esg2wu"
              defaultMessage="Previous"
              description="previous step, button"
            />
          </Button>
        )}
        {step !== ProductVariantCreatorStep.summary ? (
          <Button
            data-test-id="next-step"
            className={classes.button}
            disabled={!canHitNext(step, wizardData, variantsLeft)}
            variant="primary"
            onClick={nextStep}
          >
            <FormattedMessage
              id="+bFHzi"
              defaultMessage="Next"
              description="button"
            />
          </Button>
        ) : (
          <Button
            className={classes.button}
            disabled={!canHitNext(step, wizardData, variantsLeft)}
            variant="primary"
            onClick={() => onSubmit(dedupeListings(wizardData).variants)}
          >
            <FormattedMessage
              id="Q3j++G"
              defaultMessage="Create"
              description="create multiple variants, button"
            />
          </Button>
        )}
      </PageHeader>
      <Hr className={classes.hr} />
      <div className={classes.content}>
        <ProductVariantCreatorContent
          {...contentProps}
          attributes={attributes}
          channelListings={channelListings}
          data={wizardData}
          dispatchFormDataAction={dispatchFormDataAction}
          errors={errors}
          variantsLeft={variantsLeft}
          step={step}
          warehouses={warehouses}
        />
      </div>
    </Container>
  );
};

ProductVariantCreatePage.displayName = "ProductVariantCreatePage";
export default ProductVariantCreatePage;
