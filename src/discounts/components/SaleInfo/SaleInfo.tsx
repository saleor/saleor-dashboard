import CardTitle from "@dashboard/components/CardTitle";
import { DiscountErrorFragment } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { getFormErrors } from "@dashboard/utils/errors";
import getDiscountErrorMessage from "@dashboard/utils/errors/discounts";
import { Card, CardContent, TextField } from "@material-ui/core";
import React from "react";
import { useIntl } from "react-intl";

import { SaleDetailsPageFormData } from "../SaleDetailsPage";

export interface SaleInfoProps {
  data: SaleDetailsPageFormData;
  disabled: boolean;
  errors: DiscountErrorFragment[];
  onChange: (event: React.ChangeEvent<any>) => void;
}

const SaleInfo: React.FC<SaleInfoProps> = ({ data, disabled, errors, onChange }) => {
  const intl = useIntl();
  const formErrors = getFormErrors(["name"], errors);

  return (
    <Card>
      <CardTitle title={intl.formatMessage(commonMessages.generalInformations)} />
      <CardContent>
        <TextField
          disabled={disabled}
          error={!!formErrors.name}
          helperText={getDiscountErrorMessage(formErrors.name, intl)}
          name={"name" as keyof SaleDetailsPageFormData}
          onChange={onChange}
          label={intl.formatMessage({
            id: "F56hOz",
            defaultMessage: "Name",
            description: "sale name",
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
