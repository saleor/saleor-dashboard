import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import {
  TaxConfigurationPerCountryFragment,
  TaxConfigurationUpdateInput
} from "@saleor/graphql";
import { FormChange } from "@saleor/hooks/useForm";
import {
  DeleteIcon,
  IconButton,
  ListItem,
  ListItemCell
} from "@saleor/macaw-ui";
import React from "react";

import { useStyles } from "../styles";

interface TaxCountryExceptionListItemProps {
  country: TaxConfigurationPerCountryFragment | undefined;
  onDelete: () => void;
  onChange: FormChange;
}

export const TaxCountryExceptionListItem: React.FC<TaxCountryExceptionListItemProps> = ({
  country,
  onDelete,
  onChange
}) => {
  const classes = useStyles();
  return (
    <ListItem hover={false}>
      <ListItemCell>{country.country.country}</ListItemCell>
      <ListItemCell className={classes.center}>
        <ControlledCheckbox
          className={classes.center}
          checked={country.chargeTaxes}
          name={"chargeTaxes" as keyof TaxConfigurationUpdateInput}
          onChange={onChange}
        />
      </ListItemCell>
      <ListItemCell className={classes.center}>
        <ControlledCheckbox
          className={classes.center}
          checked={country.displayGrossPrices}
          name={"displayGrossPrices" as keyof TaxConfigurationUpdateInput}
          onChange={onChange}
        />
      </ListItemCell>
      <ListItemCell>
        <IconButton onClick={onDelete} variant="secondary">
          <DeleteIcon />
        </IconButton>
      </ListItemCell>
    </ListItem>
  );
};
export default TaxCountryExceptionListItem;
