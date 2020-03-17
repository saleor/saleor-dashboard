import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import React from "react";
import { useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import { commonMessages } from "@saleor/intl";
import { getFormErrors } from "@saleor/utils/errors";
import getShippingErrorMessage from "@saleor/utils/errors/shipping";
import { ShippingErrorFragment } from "@saleor/shipping/types/ShippingErrorFragment";
import { FormData } from "../ShippingZoneDetailsPage";

export interface ShippingZoneInfoProps {
  data: FormData;
  disabled: boolean;
  errors: ShippingErrorFragment[];
  onChange: (event: React.ChangeEvent<any>) => void;
}

const ShippingZoneInfo: React.FC<ShippingZoneInfoProps> = ({
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
          fullWidth
          helperText={getShippingErrorMessage(formErrors.name, intl)}
          label={intl.formatMessage({
            defaultMessage: "Shipping Zone Name"
          })}
          name={"name" as keyof FormData}
          value={data.name}
          onChange={onChange}
        />
      </CardContent>
    </Card>
  );
};
ShippingZoneInfo.displayName = "ShippingZoneInfo";
export default ShippingZoneInfo;
