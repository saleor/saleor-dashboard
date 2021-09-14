import {
  Card,
  CardContent,
  Divider,
  TextField,
  Typography
} from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import RadioGroupField from "@saleor/components/RadioGroupField";
import { commonMessages } from "@saleor/intl";
import { makeStyles } from "@saleor/macaw-ui";
import { UserError } from "@saleor/types";
import { ProductTypeKindEnum } from "@saleor/types/globalTypes";
import { getFieldError } from "@saleor/utils/errors";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";

const useStyles = makeStyles(
  theme => ({
    root: {
      overflow: "visible"
    },
    option: {
      marginTop: theme.spacing(-0.25),
      marginBottom: theme.spacing()
    }
  }),
  { name: "ProductTypeDetails" }
);

interface ProductTypeDetailsProps {
  data?: {
    name: string;
    kind: ProductTypeKindEnum;
  };
  disabled: boolean;
  errors: UserError[];
  onChange: (event: React.ChangeEvent<any>) => void;
  onKindChange: (event: React.ChangeEvent<any>) => void;
}

const ProductTypeDetails: React.FC<ProductTypeDetailsProps> = props => {
  const { data, disabled, errors, onChange, onKindChange } = props;
  const classes = useStyles(props);

  const intl = useIntl();

  const kindOptions = [
    {
      title: messages.optionNormalTitle,
      subtitle: messages.optionNormalDescription,
      type: ProductTypeKindEnum.NORMAL
    },
    {
      title: messages.optionGiftCardTitle,
      subtitle: messages.optionGiftCardDescription,
      type: ProductTypeKindEnum.GIFT_CARD
    }
  ];

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
          label={intl.formatMessage(messages.productTypeName)}
          name="name"
          onChange={onChange}
          value={data.name}
        />
      </CardContent>
      <Divider />
      <CardContent>
        <RadioGroupField
          disabled={disabled}
          choices={kindOptions.map(option => ({
            label: (
              <div
                className={classes.option}
                data-test-id={`product-type-kind-option-${option.type}`}
              >
                <Typography variant="body1">
                  <FormattedMessage {...option.title} />
                </Typography>
                <Typography color="textSecondary" variant="caption">
                  <FormattedMessage {...option.subtitle} />
                </Typography>
              </div>
            ),
            value: option.type
          }))}
          name="kind"
          onChange={onKindChange}
          value={data.kind}
        />
      </CardContent>
    </Card>
  );
};
ProductTypeDetails.displayName = "ProductTypeDetails";
export default ProductTypeDetails;
