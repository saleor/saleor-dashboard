import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Theme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/styles";
import React from "react";
import { FormattedMessage } from "react-intl";
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
    width: 600
  }
}));

export interface ProductVariantCreateDialogProps
  extends Omit<
    ProductVariantCreateContentProps,
    "dispatchFormDataAction" | "step"
  > {
  open: boolean;
  onClose: () => undefined;
  onSubmit: (data: ProductVariantCreateFormData) => void;
}

const ProductVariantCreateDialog: React.FC<
  ProductVariantCreateDialogProps
> = props => {
  const { open, onClose, ...contentProps } = props;
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
            variant="contained"
            onClick={handleNextStep}
          >
            <FormattedMessage defaultMessage="Next" description="button" />
          </Button>
        ) : (
          <Button className={classes.button} variant="contained">
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
