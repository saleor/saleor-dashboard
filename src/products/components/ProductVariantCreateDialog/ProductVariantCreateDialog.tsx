import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Theme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/styles";
import React from "react";
import { FormattedMessage } from "react-intl";

import { ProductVariantBulkCreateInput } from "../../../types/globalTypes";
import { initialForm, ProductVariantCreateFormData } from "./form";
import ProductVariantCreateContent, {
  ProductVariantCreateContentProps
} from "./ProductVariantCreateContent";
import reduceProductVariantCreateFormData from "./reducer";
import { ProductVariantCreateStep } from "./types";

const useStyles = makeStyles((theme: Theme) => ({
  button: {
    marginLeft: theme.spacing.unit * 2
  },
  content: {
    overflowX: "visible",
    overflowY: "hidden",
    width: 800
  }
}));

function canHitNext(
  step: ProductVariantCreateStep,
  data: ProductVariantCreateFormData
): boolean {
  switch (step) {
    case "attributes":
      return data.attributes.length > 0;
    case "values":
      return data.attributes.every(attribute => attribute.values.length > 0);
    case "prices":
      if (data.price.all) {
        if (data.price.value === "") {
          return false;
        }
      } else {
        if (
          data.price.attribute === "" ||
          data.price.values.some(attributeValue => attributeValue.value === "")
        ) {
          return false;
        }
      }

      if (data.stock.all) {
        if (data.stock.value === "") {
          return false;
        }
      } else {
        if (
          data.stock.attribute === "" ||
          data.stock.values.some(attributeValue => attributeValue.value === "")
        ) {
          return false;
        }
      }

      return true;
    case "summary":
      return data.variants.every(variant => variant.sku !== "");

    default:
      return false;
  }
}

export interface ProductVariantCreateDialogProps
  extends Omit<
    ProductVariantCreateContentProps,
    "data" | "dispatchFormDataAction" | "step"
  > {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ProductVariantBulkCreateInput[]) => void;
}

const ProductVariantCreateDialog: React.FC<
  ProductVariantCreateDialogProps
> = props => {
  const { open, onClose, onSubmit, ...contentProps } = props;
  const classes = useStyles(props);
  const [step, setStep] = React.useState<ProductVariantCreateStep>(
    "attributes"
  );

  function handleNextStep() {
    switch (step) {
      case "attributes":
        setStep("values");
        break;
      case "values":
        setStep("prices");
        break;
      case "prices":
        setStep("summary");
        break;
    }
  }

  function handlePrevStep() {
    switch (step) {
      case "values":
        setStep("attributes");
        break;
      case "prices":
        setStep("values");
        break;
      case "summary":
        setStep("prices");
        break;
    }
  }

  const [data, dispatchFormDataAction] = React.useReducer(
    reduceProductVariantCreateFormData,
    initialForm
  );

  return (
    <Dialog open={open} maxWidth="md">
      <DialogTitle>
        <FormattedMessage
          defaultMessage="Assign Attribute"
          description="dialog header"
        />
      </DialogTitle>
      <DialogContent className={classes.content}>
        <ProductVariantCreateContent
          {...contentProps}
          data={data}
          dispatchFormDataAction={dispatchFormDataAction}
          step={step}
        />
      </DialogContent>
      <DialogActions>
        <Button className={classes.button} onClick={onClose}>
          <FormattedMessage defaultMessage="Cancel" description="button" />
        </Button>
        {step !== "attributes" && (
          <Button
            className={classes.button}
            color="primary"
            onClick={handlePrevStep}
          >
            <FormattedMessage defaultMessage="Back" description="button" />
          </Button>
        )}
        {step !== "summary" ? (
          <Button
            className={classes.button}
            color="primary"
            disabled={!canHitNext(step, data)}
            variant="contained"
            onClick={handleNextStep}
          >
            <FormattedMessage defaultMessage="Next" description="button" />
          </Button>
        ) : (
          <Button
            className={classes.button}
            color="primary"
            disabled={!canHitNext(step, data)}
            variant="contained"
            onClick={() => onSubmit(data.variants)}
          >
            <FormattedMessage
              defaultMessage="Create"
              description="create multiple variants, button"
            />
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

ProductVariantCreateDialog.displayName = "ProductVariantCreateDialog";
export default ProductVariantCreateDialog;
