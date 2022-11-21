import { Card, CardActions, CardContent } from "@material-ui/core";
import { Button } from "@saleor/components/Button";
import CardTitle from "@saleor/components/CardTitle";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import FormSpacer from "@saleor/components/FormSpacer";
import { sectionNames } from "@saleor/intl";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { TaxesConfigurationFormData } from "../CountryListPage";

interface TaxConfigurationProps {
  data: TaxesConfigurationFormData;
  disabled: boolean;
  onChange: (event: React.ChangeEvent<any>) => void;
  onTaxFetch: () => void;
}

const useStyles = makeStyles(
  {
    content: {
      paddingBottom: 0,
    },
  },
  { name: "TaxConfiguration" },
);

export const TaxConfiguration: React.FC<TaxConfigurationProps> = props => {
  const { data, disabled, onChange, onTaxFetch } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  return (
    <Card>
      <CardTitle title={intl.formatMessage(sectionNames.configuration)} />
      <CardContent className={classes.content}>
        <ControlledCheckbox
          name={"includeTax" as keyof FormData}
          label={intl.formatMessage({
            id: "4EuJKs",
            defaultMessage: "All products prices are entered with tax included",
          })}
          checked={data.includeTax}
          onChange={onChange}
          disabled={disabled}
        />
        <FormSpacer />
        <ControlledCheckbox
          name={"showGross" as keyof FormData}
          label={intl.formatMessage({
            id: "98isC5",
            defaultMessage: "Show gross prices to customers in the storefront",
          })}
          checked={data.showGross}
          onChange={onChange}
          disabled={disabled}
        />
        <FormSpacer />
        <ControlledCheckbox
          name={"chargeTaxesOnShipping" as keyof FormData}
          label={intl.formatMessage({
            id: "FNKhkx",
            defaultMessage: "Charge taxes on shipping rates",
          })}
          checked={data.chargeTaxesOnShipping}
          onChange={onChange}
          disabled={disabled}
        />
        <FormSpacer />
      </CardContent>
      <CardActions>
        <Button disabled={disabled} onClick={onTaxFetch}>
          <FormattedMessage
            id="+OV+Gj"
            defaultMessage="Fetch taxes"
            description="button"
          />
        </Button>
      </CardActions>
    </Card>
  );
};
export default TaxConfiguration;
