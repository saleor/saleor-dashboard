import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import React from "react";
import { useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import { commonMessages } from "@saleor/intl";
import { FormErrors } from "@saleor/types";

const styles = createStyles({
  root: {
    overflow: "visible"
  }
});

interface ProductTypeDetailsProps extends WithStyles<typeof styles> {
  data?: {
    name: string;
  };
  disabled: boolean;
  errors: FormErrors<"name">;
  onChange: (event: React.ChangeEvent<any>) => void;
}

const ProductTypeDetails = withStyles(styles, { name: "ProductTypeDetails" })(
  ({ classes, data, disabled, errors, onChange }: ProductTypeDetailsProps) => {
    const intl = useIntl();

    return (
      <Card className={classes.root}>
        <CardTitle
          title={intl.formatMessage(commonMessages.generalInformations)}
        />
        <CardContent>
          <TextField
            disabled={disabled}
            error={!!errors.name}
            fullWidth
            helperText={errors.name}
            label={intl.formatMessage({
              defaultMessage: "Product Type Name"
            })}
            name="name"
            onChange={onChange}
            value={data.name}
          />
        </CardContent>
      </Card>
    );
  }
);
ProductTypeDetails.displayName = "ProductTypeDetails";
export default ProductTypeDetails;
