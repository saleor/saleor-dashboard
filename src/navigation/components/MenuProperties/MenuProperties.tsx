import { DashboardCard } from "@dashboard/components/Card";
import { MenuErrorFragment } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { getFormErrors } from "@dashboard/utils/errors";
import getMenuErrorMessage from "@dashboard/utils/errors/menu";
import { TextField } from "@material-ui/core";
import * as React from "react";
import { useIntl } from "react-intl";

import { MenuDetailsFormData } from "../MenuDetailsPage";

export interface MenuPropertiesProps {
  data: MenuDetailsFormData;
  disabled: boolean;
  errors: MenuErrorFragment[];
  onChange: (event: React.ChangeEvent<any>) => void;
}

const MenuProperties = ({ data, disabled, errors, onChange }: MenuPropertiesProps) => {
  const intl = useIntl();
  const formErrors = getFormErrors(["name"], errors);

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage(commonMessages.generalInformations)}
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
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
      </DashboardCard.Content>
    </DashboardCard>
  );
};

MenuProperties.displayName = "MenuProperties";
export default MenuProperties;
