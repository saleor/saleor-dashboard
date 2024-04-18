import CardTitle from "@dashboard/components/CardTitle";
import { MenuErrorFragment } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { getFormErrors } from "@dashboard/utils/errors";
import getMenuErrorMessage from "@dashboard/utils/errors/menu";
import { Card, CardContent, TextField } from "@material-ui/core";
import React from "react";
import { useIntl } from "react-intl";

import { MenuDetailsFormData } from "../MenuDetailsPage";

export interface MenuPropertiesProps {
  data: MenuDetailsFormData;
  disabled: boolean;
  errors: MenuErrorFragment[];
  onChange: (event: React.ChangeEvent<any>) => void;
}

const MenuProperties: React.FC<MenuPropertiesProps> = ({ data, disabled, errors, onChange }) => {
  const intl = useIntl();
  const formErrors = getFormErrors(["name"], errors);

  return (
    <Card>
      <CardTitle title={intl.formatMessage(commonMessages.generalInformations)} />
      <CardContent>
        <TextField
          data-test-id="menu-name"
          disabled={disabled}
          error={!!formErrors.name}
          name={"name" as keyof MenuDetailsFormData}
          fullWidth
          label={intl.formatMessage({
            id: "jhh/D6",
            defaultMessage: "Menu Title",
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
