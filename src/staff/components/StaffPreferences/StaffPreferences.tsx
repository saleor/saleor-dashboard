import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import FormSpacer from "@saleor/components/FormSpacer";
import { Locale, localeNames } from "@saleor/components/Locale";
import SingleAutocompleteSelectField from "@saleor/components/SingleAutocompleteSelectField";
import { capitalize } from "@saleor/misc";

interface StaffPreferencesProps {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

const StaffPreferences: React.FC<StaffPreferencesProps> = ({
  locale,
  onLocaleChange
}) => {
  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Preferences",
          description: "section header"
        })}
      />
      <CardContent>
        <SingleAutocompleteSelectField
          choices={Object.values(Locale).map(locale => ({
            label: capitalize(localeNames[locale]),
            value: locale
          }))}
          displayValue={localeNames[locale]}
          helperText={intl.formatMessage({
            defaultMessage:
              "Selecting this will change the language of your dashboard"
          })}
          label={intl.formatMessage({
            defaultMessage: "Preferred Language"
          })}
          name="locale"
          value={locale}
          onChange={event => onLocaleChange(event.target.value)}
        />
        <FormSpacer />
        <Typography>
          <FormattedMessage defaultMessage="Please note, while all currency and date adjustments are complete, language translations are at varying degrees of completion." />
        </Typography>
      </CardContent>
    </Card>
  );
};
StaffPreferences.displayName = "StaffPreferences";
export default StaffPreferences;
