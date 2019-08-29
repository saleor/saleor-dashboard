import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {
  createStyles,
  Theme,
  WithStyles,
  withStyles
} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import React from "react";
import { useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import { commonMessages } from "@saleor/intl";
import { FormData } from "../SaleDetailsPage";

export interface SaleInfoProps {
  data: FormData;
  disabled: boolean;
  errors: {
    name?: string;
  };
  onChange: (event: React.ChangeEvent<any>) => void;
}

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: "grid",
      gridColumnGap: theme.spacing.unit * 2 + "px",
      gridTemplateColumns: "3fr 1fr"
    }
  });

const SaleInfo = withStyles(styles, {
  name: "SaleInfo"
})(
  ({
    classes,
    data,
    disabled,
    errors,
    onChange
  }: SaleInfoProps & WithStyles<typeof styles>) => {
    const intl = useIntl();

    return (
      <Card>
        <CardTitle
          title={intl.formatMessage(commonMessages.generalInformations)}
        />
        <CardContent className={classes.root}>
          <TextField
            disabled={disabled}
            error={!!errors.name}
            helperText={errors.name}
            name={"name" as keyof FormData}
            onChange={onChange}
            label={intl.formatMessage({
              defaultMessage: "Name",
              description: "sale name"
            })}
            value={data.name}
            fullWidth
          />
        </CardContent>
      </Card>
    );
  }
);
SaleInfo.displayName = "SaleInfo";
export default SaleInfo;
