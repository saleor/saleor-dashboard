import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import { FormSpacer } from "@saleor/components/FormSpacer";
import Hr from "@saleor/components/Hr";
import RadioGroupField from "@saleor/components/RadioGroupField";
import TextFieldWithChoice from "@saleor/components/TextFieldWithChoice";
import { getFieldError } from "@saleor/utils/errors";
import { UserError } from "../../../types";
import { DiscountValueTypeEnum } from "../../../types/globalTypes";
import { translateVoucherTypes } from "../../translations";
import { FormData } from "../VoucherDetailsPage";

interface VoucherValueProps {
  data: FormData;
  defaultCurrency: string;
  errors: UserError[];
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
          error={!!getFieldError(errors, "discountValue")}
          ChoiceProps={{
            label:
              data.discountType === DiscountValueTypeEnum.FIXED
                ? defaultCurrency
                : "%",
            name: "discountType" as keyof FormData,
            values: null
          }}
          helperText={getFieldError(errors, "discountValue")?.message}
          name={"value" as keyof FormData}
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
              error={!!getFieldError(errors, "type")}
              hint={getFieldError(errors, "type")?.message}
              label={intl.formatMessage({
                defaultMessage: "Voucher Specific Information"
              })}
              name={"type" as keyof FormData}
              value={data.type}
              onChange={onChange}
            />
          </>
        )}
        <Hr className={classes.hr} />
        <FormSpacer />
        <ControlledCheckbox
          name={"applyOncePerOrder" as keyof FormData}
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
