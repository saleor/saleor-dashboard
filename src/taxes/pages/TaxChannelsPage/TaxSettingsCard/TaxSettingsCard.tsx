import CardTitle from "@dashboard/components/CardTitle";
import ControlledCheckbox from "@dashboard/components/ControlledCheckbox";
import Grid from "@dashboard/components/Grid";
import SingleSelectField, {
  Choice,
} from "@dashboard/components/SingleSelectField";
import { TaxConfigurationUpdateInput } from "@dashboard/graphql";
import { FormChange } from "@dashboard/hooks/useForm";
import { taxesMessages } from "@dashboard/taxes/messages";
import {
  Card,
  CardContent,
  Divider,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@material-ui/core";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { TaxConfigurationFormData } from "../TaxChannelsPage";
import { useStyles } from "./styles";

export interface TaxSettingsCardProps {
  values: TaxConfigurationFormData;
  strategyChoices: Choice[];
  onChange: FormChange;
  strategyChoicesLoading: boolean;
}

export const TaxSettingsCard: React.FC<TaxSettingsCardProps> = ({
  values,
  strategyChoices,
  onChange,
  strategyChoicesLoading,
}) => {
  const intl = useIntl();
  const classes = useStyles();

  return (
    <Card>
      <CardTitle title={intl.formatMessage(taxesMessages.defaultSettings)} />
      <CardContent>
        <Typography className={classes.supportHeader}>
          <FormattedMessage {...taxesMessages.chargeTaxesHeader} />
        </Typography>
        <div className={classes.taxStrategySection}>
          <ControlledCheckbox
            data-test-id="charge-taxes-for-this-channel-checkbox"
            checked={values.chargeTaxes}
            name={"chargeTaxes" as keyof TaxConfigurationUpdateInput}
            onChange={onChange}
            label={intl.formatMessage(taxesMessages.chargeTaxes)}
          />
          <div
            className={classes.singleSelectWrapper}
            data-test-id="app-flat-select"
          >
            <span className={classes.hint}>
              <FormattedMessage {...taxesMessages.taxStrategyHint} />{" "}
            </span>
            <SingleSelectField
              className={classes.singleSelectField}
              choices={strategyChoices}
              disabled={strategyChoicesLoading || !values.chargeTaxes}
              value={values.taxCalculationStrategy}
              name={
                "taxCalculationStrategy" as keyof TaxConfigurationUpdateInput
              }
              onChange={onChange}
            />
          </div>
        </div>
      </CardContent>
      <Divider />
      <CardContent data-test-id="entered-rendered-prices-section">
        <Grid variant="uniform">
          <RadioGroup
            value={values.pricesEnteredWithTax}
            name={"pricesEnteredWithTax" as keyof TaxConfigurationUpdateInput}
            onChange={e => {
              onChange({
                target: {
                  name: e.target.name,
                  value: e.target.value === "true",
                },
              });
            }}
            className={classes.showCheckboxShadows}
          >
            <Typography className={classes.supportHeader}>
              <FormattedMessage {...taxesMessages.enteredPrices} />
            </Typography>
            <FormControlLabel
              value={true}
              control={<Radio />}
              label={intl.formatMessage(taxesMessages.pricesWithTaxLabel)}
            />
            <FormControlLabel
              value={false}
              control={<Radio />}
              label={intl.formatMessage(taxesMessages.pricesWithoutTaxLabel)}
            />
          </RadioGroup>
          <div className={classes.showCheckboxShadows}>
            <Typography className={classes.supportHeader}>
              <FormattedMessage {...taxesMessages.renderedPrices} />
            </Typography>
            <ControlledCheckbox
              label={intl.formatMessage(taxesMessages.showGrossHeader)}
              name={"displayGrossPrices" as keyof TaxConfigurationUpdateInput}
              checked={values.displayGrossPrices}
              onChange={onChange}
            />
          </div>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TaxSettingsCard;
