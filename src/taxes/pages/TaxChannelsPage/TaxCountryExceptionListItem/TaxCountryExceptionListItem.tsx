// @ts-strict-ignore
import ControlledCheckbox from "@dashboard/components/ControlledCheckbox";
import SingleSelectField, { Choice } from "@dashboard/components/SingleSelectField";
import { TaxConfigurationUpdateInput } from "@dashboard/graphql";
import { FormChange } from "@dashboard/hooks/useForm";
import { LegacyFlowWarning } from "@dashboard/taxes/components";
import { Divider } from "@material-ui/core";
import { ListItem, ListItemCell } from "@saleor/macaw-ui";
import { Box, Button, TrashBinIcon } from "@saleor/macaw-ui-next";
import React from "react";

import { useStyles } from "../styles";
import { TaxCountryConfiguration } from "../TaxChannelsPage";

interface TaxCountryExceptionListItemProps {
  country: TaxCountryConfiguration | undefined;
  onDelete: () => void;
  onChange: FormChange;
  divider: boolean;
  strategyChoices: Choice[];
  strategyChoicesLoading: boolean;
}

export const TaxCountryExceptionListItem: React.FC<TaxCountryExceptionListItemProps> = ({
  country,
  onDelete,
  onChange,
  strategyChoices,
  divider = true,
  strategyChoicesLoading,
}) => {
  const classes = useStyles();

  return (
    <>
      <ListItem hover={false} className={classes.noDivider} data-test-id="exception-country">
        <ListItemCell>{country.country.country}</ListItemCell>
        <ListItemCell className={classes.cell}>
          {!strategyChoicesLoading && (
            <LegacyFlowWarning taxCalculationStrategy={country.taxCalculationStrategy} />
          )}
          <Box display="flex">
            <ControlledCheckbox
              className={classes.center}
              checked={country.chargeTaxes}
              name={"chargeTaxes" as keyof TaxConfigurationUpdateInput}
              onChange={onChange}
            />
            <SingleSelectField
              choices={strategyChoices}
              disabled={!country.chargeTaxes || strategyChoicesLoading}
              value={country.taxCalculationStrategy}
              name={"taxCalculationStrategy" as keyof TaxConfigurationUpdateInput}
              onChange={onChange}
            />
          </Box>
        </ListItemCell>
        <ListItemCell className={classes.center} data-test-id="display-gross-prices-checkbox">
          <ControlledCheckbox
            className={classes.center}
            checked={country.displayGrossPrices}
            name={"displayGrossPrices" as keyof TaxConfigurationUpdateInput}
            onChange={onChange}
          />
        </ListItemCell>
        <ListItemCell>
          <Button size="small" onClick={onDelete} variant="secondary" icon={<TrashBinIcon />} />
        </ListItemCell>
      </ListItem>
      {divider && <Divider />}
    </>
  );
};
export default TaxCountryExceptionListItem;
