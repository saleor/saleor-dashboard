// @ts-strict-ignore
import ControlledCheckbox from "@dashboard/components/ControlledCheckbox";
import SingleSelectField, {
  Choice,
} from "@dashboard/components/SingleSelectField";
import {
  TaxConfigurationPerCountryFragment,
  TaxConfigurationUpdateInput,
} from "@dashboard/graphql";
import { FormChange } from "@dashboard/hooks/useForm";
import { Divider } from "@material-ui/core";
import {
  DeleteIcon,
  IconButton,
  ListItem,
  ListItemCell,
} from "@saleor/macaw-ui";
import React from "react";

import { useStyles } from "../styles";

interface TaxCountryExceptionListItemProps {
  country: TaxConfigurationPerCountryFragment | undefined;
  onDelete: () => void;
  onChange: FormChange;
  divider: boolean;
  strategyChoices: Choice[];
}

export const TaxCountryExceptionListItem: React.FC<
  TaxCountryExceptionListItemProps
> = ({ country, onDelete, onChange, strategyChoices, divider = true }) => {
  const classes = useStyles();
  return (
    <>
      <ListItem hover={false} className={classes.noDivider}>
        <ListItemCell>{country.country.country}</ListItemCell>
        <ListItemCell className={classes.center}>
          <ControlledCheckbox
            className={classes.center}
            checked={country.chargeTaxes}
            name={"chargeTaxes" as keyof TaxConfigurationUpdateInput}
            onChange={onChange}
          />
          <SingleSelectField
            className={classes.selectField}
            choices={strategyChoices}
            disabled={!country.chargeTaxes}
            value={country.taxCalculationStrategy}
            name={"taxCalculationStrategy" as keyof TaxConfigurationUpdateInput}
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
      {divider && <Divider />}
    </>
  );
};
export default TaxCountryExceptionListItem;
