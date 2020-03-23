import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import React from "react";
import { useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import { commonMessages } from "@saleor/intl";
import { getFormErrors } from "@saleor/utils/errors";
import { DiscountErrorFragment } from "@saleor/discounts/types/DiscountErrorFragment";
import getDiscountErrorMessage from "@saleor/utils/errors/discounts";
import { FormData } from "../SaleDetailsPage";

export interface SaleInfoProps {
  data: FormData;
  disabled: boolean;
  errors: DiscountErrorFragment[];
  onChange: (event: React.ChangeEvent<any>) => void;
}

const SaleInfo: React.FC<SaleInfoProps> = ({
  data,
  disabled,
  errors,
  onChange
}) => {
  const intl = useIntl();

  const formErrors = getFormErrors(["name"], errors);

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage(commonMessages.generalInformations)}
      />
      <CardContent>
        <TextField
          disabled={disabled}
          error={!!formErrors.name}
          helperText={getDiscountErrorMessage(formErrors.name, intl)}
          name={"name" as keyof FormData}
          onChange={onChange}
          label={intl.formatMessage({
            defaultMessage: "Name",
            description: "sale name"
          })}
          value={data.name}
          fullWidth
        />
      </CardContent>
    </Card>
  );
};
SaleInfo.displayName = "SaleInfo";
export default SaleInfo;
