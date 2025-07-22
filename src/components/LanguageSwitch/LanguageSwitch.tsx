import { LanguageCodeEnum, LanguageFragment } from "@dashboard/graphql";
import { Combobox, ComboboxProps } from "@saleor/macaw-ui-next";
import React from "react";

export interface LanguageSwitchProps
  extends ComboboxProps<{ value: LanguageCodeEnum; label: string }, LanguageCodeEnum> {
  currentLanguage: LanguageCodeEnum;
  languages: LanguageFragment[];
  onLanguageChange: (lang: LanguageCodeEnum) => string;
}

const LanguageSwitch: React.FC<LanguageSwitchProps> = props => {
  const { currentLanguage, languages, onLanguageChange, ...rest } = props;

  return (
    <Combobox
      // Hacky, because minWidth was not applied properly. We set min width to ensure it's not cut
      __minWidth={150}
      {...rest}
      value={currentLanguage}
      label="Choose language"
      options={languages.map(l => ({
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
export default LanguageSwitch;
