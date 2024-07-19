import { DashboardCard } from "@dashboard/components/Card";
import CardSpacer from "@dashboard/components/CardSpacer";
import { ShippingErrorFragment } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { getFormErrors } from "@dashboard/utils/errors";
import getShippingErrorMessage from "@dashboard/utils/errors/shipping";
import { TextField } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

const messages = defineMessages({
  descriptionCharacterLimit: {
    id: "ChAjJu",
    defaultMessage: "{numberOfCharacters} of {maxCharacters} characters",
    description: "character limit",
  },
  descriptionPlaceholder: {
    id: "FkRNk+",
    defaultMessage: "Description of a shipping zone.",
    description: "field placeholder",
  },
  name: {
    id: "YpukUN",
    defaultMessage: "Shipping zone name",
    description: "label",
  },
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
      flex: 1,
    },
    labelContainer: {
      "& span": {
        paddingRight: 30,
      },
      display: "flex",
    },
  },
  { name: "ShippingZoneCreatePage" },
);
const MAX_DESCRIPTION_LENGTH = 300;
const ShippingZoneInfo: React.FC<ShippingZoneInfoProps> = ({
  data,
  disabled,
  errors,
  onChange,
}) => {
  const intl = useIntl();
  const classes = useStyles({});
  const formErrors = getFormErrors(["name"], errors);

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage(commonMessages.generalInformations)}
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        <TextField
          disabled={disabled}
          error={!!formErrors.name}
          fullWidth
          helperText={getShippingErrorMessage(formErrors.name, intl)}
          label={intl.formatMessage(messages.name)}
          inputProps={{
            "data-test-id": "shipping-zone-name",
          }}
          name="name"
          value={data.name}
          onChange={onChange}
        />
        <CardSpacer />
        <TextField
          error={data.description.length > MAX_DESCRIPTION_LENGTH}
          name={"description"}
          data-test-id="shipping-zone-description"
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
                      numberOfCharacters: data.description.length,
                    }}
                  />
                </span>
              )}
            </div>
          }
          InputProps={{
            inputProps: {
              maxLength: MAX_DESCRIPTION_LENGTH,
            },
          }}
          value={data.description}
          onChange={onChange}
          disabled={disabled}
          fullWidth
          multiline
          placeholder={intl.formatMessage(messages.descriptionPlaceholder)}
          rows={10}
        />
      </DashboardCard.Content>
    </DashboardCard>
  );
};

ShippingZoneInfo.displayName = "ShippingZoneInfo";
export default ShippingZoneInfo;
