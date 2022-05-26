import {
  Card,
  CardContent,
  Checkbox,
  Divider,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography
} from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import Grid from "@saleor/components/Grid";
import { taxesMessages } from "@saleor/taxes/messages";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "./styles";

export const TaxSettingsCard: React.FC = () => {
  const intl = useIntl();
  const classes = useStyles();

  const [radioTest, setRadioTest] = React.useState("test1");

  return (
    <Card>
      <CardTitle title={intl.formatMessage(taxesMessages.defaultSettings)} />
      <CardContent>
        <Typography className={classes.supportHeader}>
          <FormattedMessage {...taxesMessages.taxCharging} />
        </Typography>
        <FormControlLabel
          control={<Checkbox />}
          label={intl.formatMessage(taxesMessages.chargeTaxes)}
        />
      </CardContent>
      <Divider />
      <CardContent>
        <Grid variant="uniform">
          <RadioGroup
            value={radioTest}
            onChange={e => setRadioTest(e.target.value)}
            className={classes.showCheckboxShadows}
          >
            <Typography className={classes.supportHeader}>
              <FormattedMessage {...taxesMessages.enteredPrices} />
            </Typography>
            <FormControlLabel
              control={<Radio />}
              label={intl.formatMessage(taxesMessages.pricesWithTaxLabel)}
              value="test1"
            />
            <FormControlLabel
              control={<Radio />}
              label={intl.formatMessage(taxesMessages.pricesWithoutTaxLabel)}
              value="test2"
            />
          </RadioGroup>
          <div className={classes.showCheckboxShadows}>
            <Typography className={classes.supportHeader}>
              <FormattedMessage {...taxesMessages.renderedPrices} />
            </Typography>
            <FormControlLabel
              control={<Checkbox />}
              label={intl.formatMessage(taxesMessages.showGrossHeader)}
            />
          </div>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TaxSettingsCard;
