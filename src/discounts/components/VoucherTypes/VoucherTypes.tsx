import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import React from "react";
import { useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import Grid from "@saleor/components/Grid";
import RadioGroupField from "@saleor/components/RadioGroupField";
import { getFieldError } from "@saleor/utils/errors";
import { UserError } from "../../../types";
import { DiscountValueTypeEnum } from "../../../types/globalTypes";
import { FormData } from "../VoucherDetailsPage";

interface VoucherTypesProps {
  data: FormData;
  errors: UserError[];
  disabled: boolean;
  onChange: (event: React.ChangeEvent<any>) => void;
}

const VoucherTypes = ({
  data,
  disabled,
  errors,
  onChange
}: VoucherTypesProps) => {
  const intl = useIntl();

  const voucherTypeChoices = [
    {
      label: intl.formatMessage({
        defaultMessage: "Fixed Amount",
        description: "voucher discount type"
      }),
      value: DiscountValueTypeEnum.FIXED
    },
    {
      label: intl.formatMessage({
        defaultMessage: "Percentage",
        description: "voucher discount type"
      }),
      value: DiscountValueTypeEnum.PERCENTAGE
    },
    {
      label: intl.formatMessage({
        defaultMessage: "Free Shipping",
        description: "voucher discount type"
      }),
      value: "SHIPPING"
    }
  ];

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Discount Type",
          description: "header"
        })}
      />
      <CardContent>
        <Grid variant="uniform">
          <RadioGroupField
            choices={voucherTypeChoices}
            disabled={disabled}
            error={!!getFieldError(errors, "discountType")}
            hint={getFieldError(errors, "discountType")?.message}
            name={"discountType" as keyof FormData}
            value={data.discountType}
            onChange={onChange}
          />
        </Grid>
      </CardContent>
    </Card>
  );
};
export default VoucherTypes;
