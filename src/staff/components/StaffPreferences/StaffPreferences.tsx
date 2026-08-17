import { DetailSettingsCard } from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";
import { Locale, localeNames } from "@dashboard/components/Locale";
import { capitalize } from "@dashboard/misc";
import { Box, Combobox, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

interface StaffPreferencesProps {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

export const StaffPreferences = ({
  locale,
  onLocaleChange,
}: StaffPreferencesProps): JSX.Element => {
  const intl = useIntl();
  const handleLocaleChange = async (nextLocale: Locale): Promise<void> => {
    if (!nextLocale) {
      return;
    }

    await onLocaleChange(nextLocale);
    /*
      Workaround, after changing language we reload the page.
      saleor-sdk causes the error related to wrong cache management.
      Migration to auth-sdk can solve it.
      Ref: https://github.com/saleor/saleor-dashboard/issues/4340
    */
    window.location.reload();
  };

  return (
    <DetailSettingsCard
      data-test-id="staff-preferences"
      title={intl.formatMessage({
        id: "xlY/T3",
        defaultMessage: "Interface language",
        description: "staff details sidebar card title for dashboard locale",
      })}
      intro={
        <Text size={3} color="default2">
          <FormattedMessage
            id="Z5j3J4"
            defaultMessage="Choose the language used across the dashboard."
            description="staff details interface language card intro"
          />
        </Text>
      }
    >
      <Box display="flex" flexDirection="column" gap={4}>
        <Combobox
          label={intl.formatMessage({
            id: "cv1pnG",
            defaultMessage: "Language",
            description: "staff details locale select label",
          })}
          options={Object.values(Locale).map(localeOption => ({
            label: capitalize(localeNames[localeOption]),
            value: localeOption,
          }))}
          name="locale"
          value={{
            label: localeNames[locale],
            value: locale,
          }}
          onChange={v => handleLocaleChange((v?.value ?? "") as Locale)}
        />
        <Text size={3} color="default2">
          <FormattedMessage
            id="I06jIl"
            defaultMessage="Note: some languages might have incomplete translations that will be displayed in English."
          />
        </Text>
      </Box>
    </DetailSettingsCard>
  );
};
