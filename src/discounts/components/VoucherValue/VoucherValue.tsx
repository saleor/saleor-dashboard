import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import CardTitle from "@saleor/components/CardTitle";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import { FormSpacer } from "@saleor/components/FormSpacer";
import Hr from "@saleor/components/Hr";
import RadioGroupField from "@saleor/components/RadioGroupField";
import TextFieldWithChoice from "@saleor/components/TextFieldWithChoice";
import { DiscountErrorFragment } from "@saleor/fragments/types/DiscountErrorFragment";
import { getFormErrors } from "@saleor/utils/errors";
import getDiscountErrorMessage from "@saleor/utils/errors/discounts";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { DiscountValueTypeEnum } from "../../../types/globalTypes";
import { translateVoucherTypes } from "../../translations";
import { VoucherDetailsPageFormData } from "../VoucherDetailsPage";

interface VoucherValueProps {
  data: VoucherDetailsPageFormData;
  defaultCurrency: string;
  errors: DiscountErrorFragment[];
  disabled: boolean;
  variant: string;
  onChange: (event: React.ChangeEvent<any>) => void;
}

export enum VoucherType {
  ENTIRE_ORDER = "ENTIRE_ORDER",
  SPECIFIC_PRODUCT = "SPECIFIC_PRODUCT"
}

const useStyles = makeStyles(
  theme => ({
    hr: {
      margin: theme.spacing(2, 0)
    }
  }),
  {
    name: "VoucherValue"
  }
);

const VoucherValue: React.FC<VoucherValueProps> = props => {
  const { data, defaultCurrency, disabled, errors, variant, onChange } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  const formErrors = getFormErrors(["discountValue", "type"], errors);

  const translatedVoucherTypes = translateVoucherTypes(intl);
  const voucherTypeChoices = Object.values(VoucherType).map(type => ({
    label: translatedVoucherTypes[type],
    value: type
  }));

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Value",
          description: "section header"
        })}
      />
      <CardContent>
        <TextFieldWithChoice
          disabled={disabled}
          error={!!formErrors.discountValue}
          ChoiceProps={{
            label:
              data.discountType === DiscountValueTypeEnum.FIXED
                ? defaultCurrency
                : "%",
            name: "discountType" as keyof VoucherDetailsPageFormData,
            values: null
          }}
          helperText={getDiscountErrorMessage(formErrors.discountValue, intl)}
          name={"value" as keyof VoucherDetailsPageFormData}
          onChange={onChange}
          label={intl.formatMessage({
            defaultMessage: "Discount Value"
          })}
          value={data.value}
          type="number"
          fullWidth
          inputProps={{
            min: 0
          }}
        />
        <FormSpacer />
        {variant === "update" && (
          <>
            <Hr className={classes.hr} />
            <RadioGroupField
              choices={voucherTypeChoices}
              disabled={disabled}
              error={!!formErrors.type}
              hint={getDiscountErrorMessage(formErrors.type, intl)}
              label={intl.formatMessage({
                defaultMessage: "Voucher Specific Information"
              })}
              name={"type" as keyof VoucherDetailsPageFormData}
              value={data.type}
              onChange={onChange}
            />
          </>
        )}
        <Hr className={classes.hr} />
        <FormSpacer />
        <ControlledCheckbox
          name={"applyOncePerOrder" as keyof VoucherDetailsPageFormData}
          label={
            <>
              <FormattedMessage
                defaultMessage="Only once per order"
                description="voucher application, switch button"
              />
              <Typography variant="caption">
                <FormattedMessage defaultMessage="If this option is disabled, discount will be counted for every eligible product" />
              </Typography>
            </>
          }
          checked={data.applyOncePerOrder}
          onChange={onChange}
          disabled={disabled}
        />
      </CardContent>
    </Card>
  );
};
export default VoucherValue;
