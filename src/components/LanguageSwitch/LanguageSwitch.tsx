import { LanguageCodeEnum, LanguageFragment } from "@dashboard/graphql";
import { Combobox, ComboboxProps } from "@saleor/macaw-ui-next";
import React from "react";

type BaseComboboxProps = ComboboxProps<
  { value: LanguageCodeEnum; label: string },
  LanguageCodeEnum
>;
type CutProps = Omit<BaseComboboxProps, "options" | "value">;

export interface LanguageSwitchProps extends CutProps {
  currentLanguage: LanguageCodeEnum;
  languages: LanguageFragment[];
  onLanguageChange: (lang: LanguageCodeEnum) => void;
}

// todo add LanguageSwitchWithLocalStorage, make it decorated and use in other places
export const LanguageSwitch: React.FC<LanguageSwitchProps> = props => {
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
