import { DashboardCard } from "@dashboard/components/Card";
import FormSpacer from "@dashboard/components/FormSpacer";
import { Locale, localeNames } from "@dashboard/components/Locale";
import { commonMessages } from "@dashboard/intl";
import { capitalize } from "@dashboard/misc";
import { DynamicCombobox, Option, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

interface StaffPreferencesProps {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

const StaffPreferences: React.FC<StaffPreferencesProps> = ({ locale, onLocaleChange }) => {
  const intl = useIntl();
  const handleLocaleChange = async (option: Option | null) => {
    if (!option?.value) {
      return;
    }

    await onLocaleChange(option.value as Locale);
    /*
      Workaround, after changing language we reload the page.
      saleor-sdk causes the error related to wrong cache management.
      Migration to auth-sdk can solve it.
      Ref: https://github.com/saleor/saleor-dashboard/issues/4340
    */
    window.location.reload();
  };

  const options = Object.values(Locale).map(loc => ({
    label: capitalize(localeNames[loc]),
    value: loc,
  }));

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage({
            id: "CLeDae",
            defaultMessage: "Preferences",
            description: "section header",
          })}
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        <DynamicCombobox
          helperText={intl.formatMessage({
            id: "JJgJwi",
            defaultMessage: "Selecting this will change the language of your dashboard",
          })}
          label={intl.formatMessage({
            id: "mr9jbO",
            defaultMessage: "Preferred Language",
          })}
          options={options}
          name="locale"
          value={{
            label: localeNames[locale],
            value: locale,
          }}
          onChange={handleLocaleChange}
          locale={{
            loadingText: intl.formatMessage(commonMessages.loading),
          }}
          size="small"
        />

        <FormSpacer />
        <Text>
          <FormattedMessage
            id="e822us"
            defaultMessage="Please note, while all currency and date adjustments are complete, language translations are at varying degrees of completion."
          />
        </Text>
      </DashboardCard.Content>
    </DashboardCard>
  );
};

StaffPreferences.displayName = "StaffPreferences";
export default StaffPreferences;
