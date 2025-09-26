import { LanguageCodeEnum, LanguageFragment } from "@dashboard/graphql";
import { useCachedLocales } from "@dashboard/translations/useCachedLocales";
import { Combobox, ComboboxProps } from "@saleor/macaw-ui-next";

type BaseComboboxProps = ComboboxProps<
  { value: LanguageCodeEnum; label: string },
  LanguageCodeEnum
>;
type CutProps = Omit<BaseComboboxProps, "options" | "value">;

interface LanguageSwitchProps extends CutProps {
  currentLanguage: LanguageCodeEnum;
  languages: LanguageFragment[];
  onLanguageChange: (lang: LanguageCodeEnum) => void;
}

const LanguageSwitch = (props: LanguageSwitchProps) => {
  const { currentLanguage, languages, onLanguageChange, ...rest } = props;

  return (
    <Combobox
      // Hacky, because minWidth was not applied properly. We set min width to ensure it's not cut
      __minWidth={200}
      {...rest}
      value={currentLanguage}
      label="Choose language"
      options={languages.map(l => ({
        // Adding code to label, so search works. TODO: Macaw should allow 3rd value for search only
        label: `${l.language} (${l.code})`,
        value: l.code,
      }))}
      onChange={value => {
        if (!value) {
          return; // not possible to select empty value here
        }

        return onLanguageChange(value);
      }}
    />
  );
};

LanguageSwitch.displayName = "LanguageSwitch";

export const LanguageSwitchWithCaching = (props: LanguageSwitchProps) => {
  const { cachedValues, pushValue } = useCachedLocales();

  const cachedWithLabel = cachedValues
    .map(code => props.languages.find(l => l.code === code))
    .filter(v => !!v) as LanguageFragment[];

  const summed = [...cachedWithLabel, ...props.languages];

  const withoutDuplicates = [...Array.from(new Set(summed))] as LanguageFragment[];

  return (
    <LanguageSwitch
      {...props}
      languages={withoutDuplicates}
      onLanguageChange={langCode => {
        pushValue(langCode);
        props.onLanguageChange(langCode);
      }}
    />
  );
};
