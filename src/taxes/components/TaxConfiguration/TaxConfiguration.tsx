import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import ControlledSwitch from "@saleor/components/ControlledSwitch";
import FormSpacer from "@saleor/components/FormSpacer";
import Hr from "@saleor/components/Hr";
import { sectionNames } from "@saleor/intl";
import { FormData } from "../CountryListPage";

interface TaxConfigurationProps {
  data: FormData;
  disabled: boolean;
  onChange: (event: React.ChangeEvent<any>) => void;
  onTaxFetch: () => void;
}

const styles = createStyles({
  content: {
    paddingBottom: 0
  }
});

export const TaxConfiguration = withStyles(styles, {
  name: "TaxConfiguration"
})(
  ({
    classes,
    data,
    disabled,
    onChange,
    onTaxFetch
  }: TaxConfigurationProps & WithStyles<typeof styles>) => {
    const intl = useIntl();

    return (
      <Card>
        <CardTitle title={intl.formatMessage(sectionNames.configuration)} />
        <CardContent className={classes.content}>
          <ControlledSwitch
            disabled={disabled}
            name={"includeTax" as keyof FormData}
            label={intl.formatMessage({
              defaultMessage:
                "All products prices are entered with tax included"
            })}
            onChange={onChange}
            checked={data.includeTax}
          />
          <ControlledSwitch
            disabled={disabled}
            name={"showGross" as keyof FormData}
            label={intl.formatMessage({
              defaultMessage: "Show gross prices to customers in the storefront"
            })}
            onChange={onChange}
            checked={data.showGross}
          />
          <ControlledSwitch
            disabled={disabled}
            name={"chargeTaxesOnShipping" as keyof FormData}
            label={intl.formatMessage({
              defaultMessage: "Charge taxes on shipping rates"
            })}
            onChange={onChange}
            checked={data.chargeTaxesOnShipping}
          />
          <FormSpacer />
        </CardContent>
        <Hr />
        <CardActions>
          <Button disabled={disabled} onClick={onTaxFetch} color="primary">
            <FormattedMessage
              defaultMessage="Fetch taxes"
              description="button"
            />
          </Button>
        </CardActions>
      </Card>
    );
  }
);
export default TaxConfiguration;
