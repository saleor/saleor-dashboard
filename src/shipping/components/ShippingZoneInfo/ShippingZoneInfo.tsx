import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import React from "react";
import { useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import { commonMessages } from "@saleor/intl";
import { FormErrors } from "../../../types";
import { FormData } from "../ShippingZoneDetailsPage";

export interface ShippingZoneInfoProps {
  data: FormData;
  errors: FormErrors<"name">;
  onChange: (event: React.ChangeEvent<any>) => void;
}

const ShippingZoneInfo: React.StatelessComponent<ShippingZoneInfoProps> = ({
  data,
  errors,
  onChange
}) => {
  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage(commonMessages.generalInformations)}
      />
      <CardContent>
        <TextField
          error={!!errors.name}
          fullWidth
          helperText={errors.name}
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
