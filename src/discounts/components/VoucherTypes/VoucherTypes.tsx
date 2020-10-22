import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardTitle from "@saleor/components/CardTitle";
import Grid from "@saleor/components/Grid";
import RadioGroupField from "@saleor/components/RadioGroupField";
import { DiscountErrorFragment } from "@saleor/fragments/types/DiscountErrorFragment";
import { getFormErrors } from "@saleor/utils/errors";
import getDiscountErrorMessage from "@saleor/utils/errors/discounts";
import React from "react";
import { useIntl } from "react-intl";

import { DiscountValueTypeEnum } from "../../../types/globalTypes";
import { VoucherDetailsPageFormData } from "../VoucherDetailsPage";

interface VoucherTypesProps {
  data: VoucherDetailsPageFormData;
  errors: DiscountErrorFragment[];
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

  const formErrors = getFormErrors(["discountType"], errors);

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
            error={!!formErrors.discountType}
            hint={getDiscountErrorMessage(formErrors.discountType, intl)}
            name={"discountType" as keyof VoucherDetailsPageFormData}
            value={data.discountType}
            onChange={onChange}
          />
        </Grid>
      </CardContent>
    </Card>
  );
};
export default VoucherTypes;
