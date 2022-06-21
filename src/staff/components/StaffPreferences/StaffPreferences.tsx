import { Card, CardContent, Typography } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import FormSpacer from "@saleor/components/FormSpacer";
import { Locale, localeNames } from "@saleor/components/Locale";
import SingleAutocompleteSelectField from "@saleor/components/SingleAutocompleteSelectField";
import { capitalize } from "@saleor/misc";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

interface StaffPreferencesProps {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

const StaffPreferences: React.FC<StaffPreferencesProps> = ({
  locale,
  onLocaleChange,
}) => {
  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          id: "CLeDae",
          defaultMessage: "Preferences",
          description: "section header",
        })}
      />
      <CardContent>
        <SingleAutocompleteSelectField
          choices={Object.values(Locale).map(locale => ({
            label: capitalize(localeNames[locale]),
            value: locale,
          }))}
          displayValue={localeNames[locale]}
          helperText={intl.formatMessage({
            id: "JJgJwi",
            defaultMessage:
              "Selecting this will change the language of your dashboard",
          })}
          label={intl.formatMessage({
            id: "mr9jbO",
            defaultMessage: "Preferred Language",
          })}
          name="locale"
          value={locale}
          onChange={event => onLocaleChange(event.target.value)}
        />
        <FormSpacer />
        <Typography>
          <FormattedMessage
            id="e822us"
            defaultMessage="Please note, while all currency and date adjustments are complete, language translations are at varying degrees of completion."
          />
        </Typography>
      </CardContent>
    </Card>
  );
};
StaffPreferences.displayName = "StaffPreferences";
export default StaffPreferences;
