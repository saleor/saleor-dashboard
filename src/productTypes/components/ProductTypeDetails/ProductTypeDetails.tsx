import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import CardTitle from "@saleor/components/CardTitle";
import { commonMessages } from "@saleor/intl";
import { UserError } from "@saleor/types";
import { getFieldError } from "@saleor/utils/errors";
import React from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles(
  {
    root: {
      overflow: "visible"
    }
  },
  { name: "ProductTypeDetails" }
);

interface ProductTypeDetailsProps {
  data?: {
    name: string;
  };
  disabled: boolean;
  errors: UserError[];
  onChange: (event: React.ChangeEvent<any>) => void;
}

const ProductTypeDetails: React.FC<ProductTypeDetailsProps> = props => {
  const { data, disabled, errors, onChange } = props;
  const classes = useStyles(props);

  const intl = useIntl();

  return (
    <Card className={classes.root}>
      <CardTitle
        title={intl.formatMessage(commonMessages.generalInformations)}
      />
      <CardContent>
        <TextField
          disabled={disabled}
          error={!!getFieldError(errors, "name")}
          fullWidth
          helperText={getFieldError(errors, "name")?.message}
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
};
ProductTypeDetails.displayName = "ProductTypeDetails";
export default ProductTypeDetails;
