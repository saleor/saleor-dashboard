import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from "@material-ui/core";
import ConfirmButton from "@saleor/components/ConfirmButton";
import Form from "@saleor/components/Form";
import FormSpacer from "@saleor/components/FormSpacer";
import RadioGroupField from "@saleor/components/RadioGroupField";
import { buttonMessages } from "@saleor/intl";
import { makeStyles } from "@saleor/theme";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    option: {
      marginBottom: theme.spacing(2),
      width: 400
    }
  }),
  { name: "ProductVariantCreateDialog" }
);

enum ProductVariantCreateOptionEnum {
  MULTIPLE = "multiple",
  SINGLE = "single"
}

interface ProductVariantCreateDialogForm {
  option: ProductVariantCreateOptionEnum;
}

export interface ProductVariantCreateDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (option: ProductVariantCreateOptionEnum) => void;
}

const ProductVariantCreateDialog: React.FC<ProductVariantCreateDialogProps> = props => {
  const { open, onConfirm, onClose } = props;

  const classes = useStyles(props);

  const initialForm = {
    option: ProductVariantCreateOptionEnum.MULTIPLE
  };

  const handleSubmit = (form: ProductVariantCreateDialogForm) => {
    onConfirm(form.option);
  };

  const options = [
    {
      label: (
        <div
          className={classes.option}
          data-test-id="variant-create-option-multiple"
        >
          <Typography variant="body1">
            <FormattedMessage
              defaultMessage="Create multiple variant via variant creator"
              description="option"
            />
          </Typography>
          <Typography color="textSecondary" variant="caption">
            <FormattedMessage
              defaultMessage="Use variant creator to create matrix of selected attribute values to create variants"
              description="option description"
            />
          </Typography>
        </div>
      ),
      value: ProductVariantCreateOptionEnum.MULTIPLE
    },
    {
      label: (
        <div
          className={classes.option}
          data-test-id="variant-create-option-single"
        >
          <Typography variant="body1">
            <FormattedMessage
              defaultMessage="Create single variant"
              description="option"
            />
          </Typography>
          <Typography color="textSecondary" variant="caption">
            <FormattedMessage
              defaultMessage="Create new variant using variant details view"
              description="option description"
            />
          </Typography>
        </div>
      ),
      value: ProductVariantCreateOptionEnum.SINGLE
    }
  ];

  return (
    <Dialog onClose={onClose} open={open}>
      <Form initial={initialForm} onSubmit={handleSubmit}>
        {({ change, data }) => (
          <>
            <DialogTitle>
              <FormattedMessage
                defaultMessage="Create Variants"
                description="dialog header"
              />
            </DialogTitle>
            <DialogContent>
              <Typography variant="body2">
                <FormattedMessage
                  defaultMessage="How would you like to create variants:"
                  description="create product variants"
                />
              </Typography>
              <FormSpacer />
              <RadioGroupField
                alignTop
                choices={options}
                name="option"
                value={data.option}
                onChange={change}
              />
            </DialogContent>
            <DialogActions>
              <ConfirmButton
                transitionState="default"
                color="primary"
                variant="contained"
                type="submit"
                data-test-id="submit"
                data-test="submit"
              >
                <FormattedMessage {...buttonMessages.create} />
              </ConfirmButton>
            </DialogActions>
          </>
        )}
      </Form>
    </Dialog>
  );
};
ProductVariantCreateDialog.displayName = "ProductVariantCreateDialog";
export default ProductVariantCreateDialog;
