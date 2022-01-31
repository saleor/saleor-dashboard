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
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage } from "react-intl";

import { messages } from "./messages";
import { ProductVariantCreateOptionEnum } from "./types";

const useStyles = makeStyles(
  theme => ({
    option: {
      marginBottom: theme.spacing(2),
      width: 400
    }
  }),
  { name: "ProductVariantCreateDialog" }
);

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
      title: messages.optionMultipleTitle,
      subtitle: messages.optionMultipleDescription,
      type: ProductVariantCreateOptionEnum.MULTIPLE
    },
    {
      title: messages.optionSingleTitle,
      subtitle: messages.optionSingleDescription,
      type: ProductVariantCreateOptionEnum.SINGLE
    }
  ];

  return (
    <Dialog onClose={onClose} open={open}>
      <Form initial={initialForm} onSubmit={handleSubmit}>
        {({ change, data }) => (
          <>
            <DialogTitle>
              <FormattedMessage {...messages.title} />
            </DialogTitle>
            <DialogContent>
              <Typography variant="body2">
                <FormattedMessage {...messages.description} />
              </Typography>
              <FormSpacer />
              <RadioGroupField
                alignTop
                choices={options.map(option => ({
                  label: (
                    <div
                      className={classes.option}
                      data-test-id={`variant-create-option-${option.type}`}
                    >
                      <Typography variant="body1">
                        <FormattedMessage {...option.title} />
                      </Typography>
                      <Typography color="textSecondary" variant="caption">
                        <FormattedMessage {...option.subtitle} />
                      </Typography>
                    </div>
                  ),
                  value: option.type
                }))}
                name="option"
                value={data.option}
                onChange={change}
              />
            </DialogContent>
            <DialogActions>
              <ConfirmButton
                transitionState="default"
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
