import { useExitFormDialog } from "@dashboard/components/Form/useExitFormDialog";
import { Savebar } from "@dashboard/components/Savebar";
import { useTranslationBulkValues } from "@dashboard/translations/hooks/useTranslationBulkValues";
import { useTranslationLanguagePair } from "@dashboard/translations/hooks/useTranslationLanguagePair";
import {
  type TranslationField,
  type TranslationSectionConfig,
  type TranslationsEntitiesPageProps,
} from "@dashboard/translations/types";
import { Box } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

import { TranslationContextBar } from "../TranslationContextBar/TranslationContextBar";
import { TranslationSection } from "../TranslationSection/TranslationSection";
import { translationDetailMessages } from "./messages";

interface TranslationsDetailLayoutProps
  extends Pick<
    TranslationsEntitiesPageProps,
    | "activeField"
    | "bulk"
    | "disabled"
    | "languageCode"
    | "languages"
    | "saveButtonState"
    | "onBulkChange"
    | "onBulkSubmit"
    | "onDiscard"
    | "onEdit"
    | "onSubmit"
    | "fieldErrors"
    | "onClearFieldError"
    | "onClearFieldErrors"
  > {
  sections: TranslationSectionConfig[];
  richTextResetKey?: string;
  onValueChange?: (field: TranslationField, value: string) => void;
}

export const TranslationsDetailLayout = ({
  sections,
  activeField,
  bulk,
  disabled,
  languageCode,
  languages,
  richTextResetKey,
  saveButtonState,
  onBulkChange,
  onBulkSubmit,
  onDiscard,
  onEdit,
  onSubmit,
  onValueChange,
  fieldErrors = {},
  onClearFieldError,
  onClearFieldErrors,
}: TranslationsDetailLayoutProps) => {
  const languagePair = useTranslationLanguagePair({
    languages,
    targetLanguageCode: languageCode,
  });
  const { getBulkSubmitValues, handleValueChange, resetValues } =
    useTranslationBulkValues(sections);
  const { resetFormsState } = useExitFormDialog();

  const handleFieldValueChange = (field: TranslationField, value: string) => {
    if (bulk) {
      handleValueChange(field, value);
      onClearFieldError?.(field.name);
    }

    onValueChange?.(field, value);
  };

  const handleBulkSave = async () => {
    if (!onBulkSubmit) {
      return;
    }

    const values = getBulkSubmitValues();
    const result = await onBulkSubmit(values);

    if (!result.hasErrors) {
      resetValues();
      resetFormsState();
    }
  };

  const handleBulkDiscard = () => {
    resetValues();
    resetFormsState();
    onClearFieldErrors?.();
    onDiscard();
  };

  if (!languagePair) {
    return null;
  }

  const { sourceLanguage, sourceUsesOriginalLabel, targetLanguage } = languagePair;
  const resolvedRichTextResetKey = richTextResetKey ?? languageCode;

  return (
    <Box paddingX={6} paddingTop={6} paddingBottom={6}>
      <TranslationContextBar
        sections={sections}
        sourceLanguage={sourceLanguage}
        sourceUsesOriginalLabel={sourceUsesOriginalLabel}
        targetLanguage={targetLanguage}
        bulk={bulk}
        onBulkChange={onBulkChange}
      />
      {sections.map(section => (
        <TranslationSection
          key={section.id}
          section={section}
          sourceLanguageCode={sourceLanguage?.code}
          sourceUsesOriginalLabel={sourceUsesOriginalLabel}
          targetLanguageCode={targetLanguage.code}
          targetLanguageLabel={targetLanguage.language}
          bulk={bulk}
          activeField={activeField}
          disabled={disabled}
          saveButtonState={saveButtonState}
          richTextResetKey={resolvedRichTextResetKey}
          onEdit={onEdit}
          onDiscard={onDiscard}
          onSubmit={(field, data) => onSubmit(field, data)}
          onValueChange={handleFieldValueChange}
          fieldErrors={fieldErrors}
        />
      ))}
      {bulk && onBulkSubmit && (
        <Savebar>
          <Savebar.Spacer />
          <Savebar.CancelButton onClick={handleBulkDiscard} />
          <Savebar.ConfirmButton
            transitionState={saveButtonState}
            disabled={disabled}
            onClick={handleBulkSave}
          >
            <FormattedMessage {...translationDetailMessages.saveAllTranslations} />
          </Savebar.ConfirmButton>
        </Savebar>
      )}
    </Box>
  );
};

TranslationsDetailLayout.displayName = "TranslationsDetailLayout";
