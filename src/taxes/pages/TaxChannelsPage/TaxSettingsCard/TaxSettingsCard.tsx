import {
  Card,
  CardContent,
  Divider,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import Grid from "@saleor/components/Grid";
import SingleSelectField, {
  Choice,
} from "@saleor/components/SingleSelectField";
import { TaxConfigurationUpdateInput } from "@saleor/graphql";
import { FormChange } from "@saleor/hooks/useForm";
import { taxesMessages } from "@saleor/taxes/messages";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { TaxConfigurationFormData } from "../TaxChannelsPage";
import { useStyles } from "./styles";

export interface TaxSettingsCardProps {
  values: TaxConfigurationFormData;
  strategyChoices: Choice[];
  onChange: FormChange;
}

export const TaxSettingsCard: React.FC<TaxSettingsCardProps> = ({
  values,
  strategyChoices,
  onChange,
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
            checked={values.chargeTaxes}
            name={"chargeTaxes" as keyof TaxConfigurationUpdateInput}
            onChange={onChange}
            label={intl.formatMessage(taxesMessages.chargeTaxes)}
          />
          <div className={classes.singleSelectWrapper}>
            <span className={classes.hint}>
              <FormattedMessage {...taxesMessages.taxStrategyHint} />{" "}
            </span>
            <SingleSelectField
              className={classes.singleSelectField}
              choices={strategyChoices}
              disabled={!values.chargeTaxes}
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
      <CardContent>
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
