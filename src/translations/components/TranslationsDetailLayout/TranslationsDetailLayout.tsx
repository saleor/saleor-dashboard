import { Savebar } from "@dashboard/components/Savebar";
import { isBulkFieldDirty } from "@dashboard/translations/bulkFieldDirty";
import { useTranslationBulkValues } from "@dashboard/translations/hooks/useTranslationBulkValues";
import { useTranslationExitForm } from "@dashboard/translations/hooks/useTranslationExitForm";
import { useTranslationLanguagePair } from "@dashboard/translations/hooks/useTranslationLanguagePair";
import {
  getActiveFieldsFromParams,
  isTranslationEditMode,
} from "@dashboard/translations/translationQueryParams";
import {
  type TranslationField,
  type TranslationSectionConfig,
  type TranslationsEntitiesPageProps,
} from "@dashboard/translations/types";
import { type OutputData } from "@editorjs/editorjs";
import { Box } from "@saleor/macaw-ui-next";
import { useEffect } from "react";
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
  const { getDirtyValues, handleValueChange, hasDirtyFields, resetValues } =
    useTranslationBulkValues(sections);
  const isEditMode = isTranslationEditMode(bulk, activeField);
  const { resetFormsState } = useTranslationExitForm({
    enabled: isEditMode,
    isDirty: hasDirtyFields,
  });

  useEffect(
    function resetTrackedValuesOnEditModeChange() {
      resetValues();
    },
    [activeField, bulk, resetValues],
  );

  useEffect(
    function seedDraftValuesFromEditInitial() {
      if (!isEditMode) {
        return;
      }

      const activeFields = getActiveFieldsFromParams({ activeField });

      sections.forEach(section => {
        section.fields.forEach(field => {
          const isActiveField = bulk || activeFields.includes(field.name);
          const draft = field.editInitial;

          if (!isActiveField || draft === undefined || !isBulkFieldDirty(field, draft)) {
            return;
          }

          handleValueChange(field, draft);
        });
      });
    },
    [activeField, bulk, handleValueChange, isEditMode, sections],
  );

  const clearEditState = () => {
    resetValues();
    resetFormsState();
  };

  const handleFieldValueChange = (field: TranslationField, value: string) => {
    handleValueChange(field, value);

    if (bulk) {
      onClearFieldError?.(field.name);
    }

    onValueChange?.(field, value);
  };

  const handleBulkSave = async () => {
    if (!onBulkSubmit || !hasDirtyFields) {
      return;
    }

    const values = getDirtyValues();
    const result = await onBulkSubmit(values);

    if (!result.hasErrors) {
      clearEditState();
    }
  };

  const handleBulkDiscard = () => {
    clearEditState();
    onClearFieldErrors?.();
    onDiscard();
  };

  const handleFieldDiscard = (fieldName?: string) => {
    clearEditState();
    onDiscard(fieldName);
  };

  const handleFieldSubmit = (field: TranslationField, data: string | OutputData) =>
    onSubmit(field, data).then(errors => {
      if (errors.length === 0) {
        clearEditState();
      }

      return errors;
    });

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
          hasDirtyFields={hasDirtyFields}
          saveButtonState={saveButtonState}
          richTextResetKey={resolvedRichTextResetKey}
          onEdit={onEdit}
          onDiscard={handleFieldDiscard}
          onSubmit={handleFieldSubmit}
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
            disabled={disabled || !hasDirtyFields}
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
