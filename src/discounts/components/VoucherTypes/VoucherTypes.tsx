import CardTitle from "@dashboard/components/CardTitle";
import Grid from "@dashboard/components/Grid";
import RadioGroupField from "@dashboard/components/RadioGroupField";
import { DiscountTypeEnum } from "@dashboard/discounts/types";
import { DiscountErrorFragment } from "@dashboard/graphql";
import { getFormErrors } from "@dashboard/utils/errors";
import getDiscountErrorMessage from "@dashboard/utils/errors/discounts";
import { Card, CardContent } from "@material-ui/core";
import React from "react";
import { useIntl } from "react-intl";

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
  onChange,
}: VoucherTypesProps) => {
  const intl = useIntl();

  const formErrors = getFormErrors(["discountType"], errors);

  const voucherTypeChoices = [
    {
      label: intl.formatMessage({
        id: "vXFPD6",
        defaultMessage: "Fixed Amount",
        description: "voucher discount type",
      }),
      value: DiscountTypeEnum.VALUE_FIXED,
    },
    {
      label: intl.formatMessage({
        id: "fEfCtO",
        defaultMessage: "Percentage",
        description: "voucher discount type",
      }),
      value: DiscountTypeEnum.VALUE_PERCENTAGE,
    },
    {
      label: intl.formatMessage({
        id: "sS5aVm",
        defaultMessage: "Free Shipping",
        description: "voucher discount type",
      }),
      value: DiscountTypeEnum.SHIPPING,
    },
  ];

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          id: "6cq+c+",
          defaultMessage: "Discount Type",
          description: "header",
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
