import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import ConfirmButton, {
  ConfirmButtonTransitionState
} from "@saleor/components/ConfirmButton";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import Form from "@saleor/components/Form";
import FormSpacer from "@saleor/components/FormSpacer";
import Hr from "@saleor/components/Hr";
import Skeleton from "@saleor/components/Skeleton";
import useModalDialogErrors from "@saleor/hooks/useModalDialogErrors";
import { buttonMessages } from "@saleor/intl";
import { ShippingErrorFragment } from "@saleor/shipping/types/ShippingErrorFragment";
import { getFormErrors } from "@saleor/utils/errors";
import getShippingErrorMessage from "@saleor/utils/errors/shipping";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { maybe } from "../../../misc";
import { ShippingMethodTypeEnum } from "../../../types/globalTypes";
import { ShippingZoneDetailsFragment_shippingMethods } from "../../types/ShippingZoneDetailsFragment";
import {
  getShippingPriceRateErrorMessage,
  getShippingWeightRateErrorMessage
} from "./errors";

export interface FormData {
  name: string;
  noLimits: boolean;
  minValue: string;
  maxValue: string;
  isFree: boolean;
  price: string;
}

export interface ShippingZoneRateDialogProps {
  action: "create" | "edit";
  confirmButtonState: ConfirmButtonTransitionState;
  defaultCurrency: string;
  disabled: boolean;
  errors: ShippingErrorFragment[];
  open: boolean;
  rate: ShippingZoneDetailsFragment_shippingMethods;
  variant: ShippingMethodTypeEnum;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
}

const useStyles = makeStyles(
  theme => ({
    grid: {
      display: "grid",
      gridColumnGap: theme.spacing(2),
      gridTemplateColumns: "1fr 1fr"
    },
    subheading: {
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(2)
    }
  }),
  {
    name: "ShippingZoneRateDialog"
  }
);
const ShippingZoneRateDialog: React.FC<ShippingZoneRateDialogProps> = props => {
  const {
    action,
    confirmButtonState,
    defaultCurrency,
    disabled,
    errors: apiErrors,
    onClose,
    onSubmit,
    open,
    rate,
    variant
  } = props;

  const classes = useStyles(props);
  const intl = useIntl();
  const errors = useModalDialogErrors(apiErrors, open);

  const formFields = [
    "name",
    "minimumOrderPrice",
    "minimumOrderWeight",
    "maximumOrderPrice",
    "maximumOrderWeight",
    "price"
  ];
  const formErrors = getFormErrors(formFields, errors);

  const initialForm: FormData =
    action === "create"
      ? {
          isFree: false,
          maxValue: "",
          minValue: "",
          name: "",
          noLimits: false,
          price: ""
        }
      : {
          isFree: maybe(() => rate.price.amount === 0, false),
          maxValue:
            variant === ShippingMethodTypeEnum.PRICE
              ? maybe(() => rate.maximumOrderPrice.amount.toString(), "")
              : maybe(() => rate.maximumOrderWeight.value.toString(), ""),
          minValue:
            variant === ShippingMethodTypeEnum.PRICE
              ? maybe(() => rate.minimumOrderPrice.amount.toString(), "")
              : maybe(() => rate.minimumOrderWeight.value.toString(), ""),
          name: maybe(() => rate.name, ""),
          noLimits: false,
          price: maybe(() => rate.price.amount.toString(), "")
        };
  if (action === "edit") {
    initialForm.noLimits = !initialForm.maxValue && !initialForm.minValue;
  }

  const getErrorMessage =
    variant === ShippingMethodTypeEnum.PRICE
      ? getShippingPriceRateErrorMessage
      : getShippingWeightRateErrorMessage;

  return (
    <Dialog onClose={onClose} open={open} fullWidth maxWidth="sm">
      <Form initial={initialForm} onSubmit={onSubmit}>
        {({ change, data, hasChanged }) => (
          <>
            <DialogTitle>
              {variant === ShippingMethodTypeEnum.PRICE
                ? action === "create"
                  ? intl.formatMessage({
                      defaultMessage: "Add Price Rate",
                      description: "dialog header"
                    })
                  : intl.formatMessage({
                      defaultMessage: "Edit Price Rate",
                      description: "dialog header"
                    })
                : action === "create"
                ? intl.formatMessage({
                    defaultMessage: "Add Weight Rate",
                    description:
                      "add weight based shipping method, dialog header"
                  })
                : intl.formatMessage({
                    defaultMessage: "Edit Weight Rate",
                    description:
                      "edit weight based shipping method, dialog header"
                  })}
            </DialogTitle>
            <DialogContent>
              <TextField
                disabled={disabled}
                error={!!formErrors.name}
                fullWidth
                helperText={
                  getShippingErrorMessage(formErrors.name, intl) ||
                  intl.formatMessage({
                    defaultMessage:
                      "This will be shown to customers at checkout"
                  })
                }
                label={intl.formatMessage({
                  defaultMessage: "Rate Name",
                  description: "shipping method name"
                })}
                name={"name" as keyof FormData}
                value={data.name}
                onChange={change}
              />
            </DialogContent>
            <Hr />
            <DialogContent>
              {!!variant ? (
                <>
                  <Typography
                    className={classes.subheading}
                    variant="subtitle1"
                  >
                    {variant === ShippingMethodTypeEnum.PRICE
                      ? intl.formatMessage({
                          defaultMessage: "Value range",
                          description: "order price range"
                        })
                      : intl.formatMessage({
                          defaultMessage: "Weight range",
                          description: "order weight range"
                        })}
                  </Typography>
                  <ControlledCheckbox
                    name={"noLimits" as keyof FormData}
                    label={
                      <>
                        <FormattedMessage
                          defaultMessage="There are no value limits"
                          description="shipping method has no value limits"
                        />
                        <Typography variant="caption">
                          {variant === ShippingMethodTypeEnum.PRICE
                            ? intl.formatMessage({
                                defaultMessage:
                                  "This rate will apply to all orders of all prices"
                              })
                            : intl.formatMessage({
                                defaultMessage:
                                  "This rate will apply to all orders of all weights"
                              })}
                        </Typography>
                      </>
                    }
                    checked={data.noLimits}
                    onChange={change}
                    disabled={disabled}
                  />
                  {!data.noLimits && (
                    <>
                      <FormSpacer />
                      <div className={classes.grid}>
                        <TextField
                          disabled={disabled}
                          error={
                            !!formErrors.minimumOrderPrice ||
                            !!formErrors.minimumOrderWeight
                          }
                          fullWidth
                          helperText={
                            variant === ShippingMethodTypeEnum.PRICE
                              ? getErrorMessage(
                                  formErrors.minimumOrderPrice,
                                  intl
                                )
                              : getErrorMessage(
                                  formErrors.minimumOrderWeight,
                                  intl
                                )
                          }
                          label={
                            variant === ShippingMethodTypeEnum.PRICE
                              ? intl.formatMessage({
                                  defaultMessage: "Minimal Order Value"
                                })
                              : intl.formatMessage({
                                  defaultMessage: "Minimal Order Weight"
                                })
                          }
                          name={"minValue" as keyof FormData}
                          type="number"
                          value={data.minValue}
                          onChange={change}
                        />
                        <TextField
                          disabled={disabled}
                          error={
                            !!formErrors.maximumOrderPrice ||
                            !!formErrors.maximumOrderWeight
                          }
                          fullWidth
                          helperText={
                            variant === ShippingMethodTypeEnum.PRICE
                              ? getErrorMessage(
                                  formErrors.maximumOrderPrice,
                                  intl
                                )
                              : getErrorMessage(
                                  formErrors.maximumOrderWeight,
                                  intl
                                )
                          }
                          label={
                            variant === ShippingMethodTypeEnum.PRICE
                              ? intl.formatMessage({
                                  defaultMessage: "Maximal Order Value"
                                })
                              : intl.formatMessage({
                                  defaultMessage: "Maximal Order Weight"
                                })
                          }
                          name={"maxValue" as keyof FormData}
                          type="number"
                          value={data.maxValue}
                          onChange={change}
                        />
                      </div>
                    </>
                  )}
                </>
              ) : (
                <Skeleton />
              )}
            </DialogContent>
            <Hr />
            <DialogContent>
              <Typography className={classes.subheading} variant="subtitle1">
                <FormattedMessage
                  defaultMessage="Rate"
                  description="shipping method"
                />
              </Typography>
              <ControlledCheckbox
                name={"isFree" as keyof FormData}
                label={intl.formatMessage({
                  defaultMessage: "This is free shipping",
                  description: "shipping method, switch button"
                })}
                checked={data.isFree}
                onChange={change}
                disabled={disabled}
              />
              {!data.isFree && (
                <>
                  <FormSpacer />
                  <div className={classes.grid}>
                    <TextField
                      disabled={disabled}
                      error={!!formErrors.price}
                      fullWidth
                      helperText={getErrorMessage(formErrors.price, intl)}
                      label={intl.formatMessage({
                        defaultMessage: "Rate Price",
                        description: "shipping method price"
                      })}
                      name={"price" as keyof FormData}
                      type="number"
                      value={data.price}
                      onChange={change}
                      InputProps={{
                        endAdornment: defaultCurrency
                      }}
                    />
                  </div>
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose}>
                <FormattedMessage {...buttonMessages.back} />
              </Button>
              <ConfirmButton
                disabled={disabled || !hasChanged}
                transitionState={confirmButtonState}
                color="primary"
                variant="contained"
                type="submit"
              >
                {action === "create"
                  ? intl.formatMessage({
                      defaultMessage: "Create rate",
                      description: "button"
                    })
                  : intl.formatMessage({
                      defaultMessage: "Update rate",
                      description: "button"
                    })}
              </ConfirmButton>
            </DialogActions>
          </>
        )}
      </Form>
    </Dialog>
  );
};
ShippingZoneRateDialog.displayName = "ShippingZoneRateDialog";
export default ShippingZoneRateDialog;
