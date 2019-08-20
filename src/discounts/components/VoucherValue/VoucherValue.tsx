import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import ControlledSwitch from "@saleor/components/ControlledSwitch";
import { FormSpacer } from "@saleor/components/FormSpacer";
import Hr from "@saleor/components/Hr";
import RadioGroupField from "@saleor/components/RadioGroupField";
import TextFieldWithChoice from "@saleor/components/TextFieldWithChoice";
import { FormErrors } from "../../../types";
import { DiscountValueTypeEnum } from "../../../types/globalTypes";
import { translateVoucherTypes } from "../../translations";
import { FormData } from "../VoucherDetailsPage";

interface VoucherValueProps {
  data: FormData;
  defaultCurrency: string;
  errors: FormErrors<"discountValue" | "type">;
  disabled: boolean;
  variant: string;
  onChange: (event: React.ChangeEvent<any>) => void;
}

export enum VoucherType {
  ENTIRE_ORDER = "ENTIRE_ORDER",
  SPECIFIC_PRODUCT = "SPECIFIC_PRODUCT"
}

const VoucherValue = ({
  data,
  defaultCurrency,
  disabled,
  errors,
  variant,
  onChange
}: VoucherValueProps) => {
  const intl = useIntl();

  const translatedVoucherTypes = translateVoucherTypes();
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
          error={!!errors.discountValue}
          ChoiceProps={{
            label:
              data.discountType === DiscountValueTypeEnum.FIXED
                ? defaultCurrency
                : "%",
            name: "discountType" as keyof FormData,
            values: null
          }}
          helperText={errors.discountValue}
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
            <RadioGroupField
              choices={voucherTypeChoices}
              disabled={disabled}
              error={!!errors.type}
              hint={errors.type}
              label={intl.formatMessage({
                defaultMessage: "Discount Specific Information"
              })}
              name={"type" as keyof FormData}
              value={data.type}
              onChange={onChange}
            />
            <FormSpacer />
          </>
        )}
        <Hr />
        <FormSpacer />
        <ControlledSwitch
          checked={data.applyOncePerOrder}
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
          onChange={onChange}
          name={"applyOncePerOrder" as keyof FormData}
          disabled={disabled}
        />
      </CardContent>
    </Card>
  );
};
export default VoucherValue;
