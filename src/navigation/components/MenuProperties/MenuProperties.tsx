import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import CardTitle from "@saleor/components/CardTitle";
import { MenuErrorFragment } from "@saleor/fragments/types/MenuErrorFragment";
import { commonMessages } from "@saleor/intl";
import { getFormErrors } from "@saleor/utils/errors";
import getMenuErrorMessage from "@saleor/utils/errors/menu";
import React from "react";
import { useIntl } from "react-intl";

import { MenuDetailsFormData } from "../MenuDetailsPage";

export interface MenuPropertiesProps {
  data: MenuDetailsFormData;
  disabled: boolean;
  errors: MenuErrorFragment[];
  onChange: (event: React.ChangeEvent<any>) => void;
}

const MenuProperties: React.FC<MenuPropertiesProps> = ({
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
          name={"name" as keyof MenuDetailsFormData}
          fullWidth
          label={intl.formatMessage({
            defaultMessage: "Menu Title",
            id: "menuPropertiesMenuTitle"
          })}
          helperText={getMenuErrorMessage(formErrors.name, intl)}
          value={data.name}
          onChange={onChange}
        />
      </CardContent>
    </Card>
  );
};
MenuProperties.displayName = "MenuProperties";
export default MenuProperties;
