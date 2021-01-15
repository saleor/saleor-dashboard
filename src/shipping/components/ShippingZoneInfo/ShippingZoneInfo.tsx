import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TextField from "@material-ui/core/TextField";
import CardSpacer from "@saleor/components/CardSpacer";
import CardTitle from "@saleor/components/CardTitle";
import { ShippingErrorFragment } from "@saleor/fragments/types/ShippingErrorFragment";
import { commonMessages } from "@saleor/intl";
import { getFormErrors } from "@saleor/utils/errors";
import getShippingErrorMessage from "@saleor/utils/errors/shipping";
import React from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

const messages = defineMessages({
  descriptionCharacterLimit: {
    defaultMessage: "{numberOfCharacters} of {maxCharacters} characters",
    description: "character limit"
  },
  descriptionPlaceholder: {
    defaultMessage: "Description of a shipping zone.",
    description: "field placeholder"
  },
  name: {
    defaultMessage: "Shipping zone name",
    description: "label"
  }
});

export interface ShippingZoneInfoProps {
  data: Record<"name" | "description", string>;
  disabled: boolean;
  errors: ShippingErrorFragment[];
  onChange: (event: React.ChangeEvent<any>) => void;
}

const useStyles = makeStyles(
  {
    label: {
      flex: 1
    },
    labelContainer: {
      "& span": {
        paddingRight: 30
      },
      display: "flex"
    }
  },
  { name: "ShippingZoneCreatePage" }
);

const MAX_DESCRIPTION_LENGTH = 300;

const ShippingZoneInfo: React.FC<ShippingZoneInfoProps> = ({
  data,
  disabled,
  errors,
  onChange
}) => {
  const intl = useIntl();
  const classes = useStyles({});

  const formErrors = getFormErrors(["name"], errors);

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage(commonMessages.generalInformations)}
      />
      <CardContent>
        <TextField
          disabled={disabled}
          error={!!formErrors.name}
          fullWidth
          helperText={getShippingErrorMessage(formErrors.name, intl)}
          label={intl.formatMessage(messages.name)}
          inputProps={{
            "data-test": "name"
          }}
          name="name"
          value={data.name}
          onChange={onChange}
        />
        <CardSpacer />
        <TextField
          error={data.description.length > MAX_DESCRIPTION_LENGTH}
          name={"description"}
          label={
            <div className={classes.labelContainer}>
              <div className={classes.label}>
                <FormattedMessage {...commonMessages.descriptionOptional} />
              </div>
              {data.description?.length > 0 && (
                <span>
                  <FormattedMessage
                    {...messages.descriptionCharacterLimit}
                    values={{
                      maxCharacters: MAX_DESCRIPTION_LENGTH,
                      numberOfCharacters: data.description.length
                    }}
                  />
                </span>
              )}
            </div>
          }
          InputProps={{
            inputProps: {
              maxLength: MAX_DESCRIPTION_LENGTH
            }
          }}
          value={data.description}
          onChange={onChange}
          disabled={disabled}
          fullWidth
          multiline
          placeholder={intl.formatMessage(messages.descriptionPlaceholder)}
          rows={10}
        />
      </CardContent>
    </Card>
  );
};
ShippingZoneInfo.displayName = "ShippingZoneInfo";
export default ShippingZoneInfo;
