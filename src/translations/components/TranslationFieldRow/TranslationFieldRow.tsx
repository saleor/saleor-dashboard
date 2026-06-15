import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { Pill } from "@dashboard/components/Pill";
import { type SubmitPromise } from "@dashboard/hooks/useForm";
import { isFieldTranslationComplete } from "@dashboard/translations/progress";
import { type TranslationField, TranslationFieldType } from "@dashboard/translations/types";
import { type OutputData } from "@editorjs/editorjs";
import { Button } from "@saleor/macaw-ui";
import { Box, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

import TranslationFieldsLong from "../TranslationFields/TranslationFieldsLong";
import TranslationFieldsRich from "../TranslationFields/TranslationFieldsRich";
import TranslationFieldsShort from "../TranslationFields/TranslationFieldsShort";
import { translationDetailMessages } from "../TranslationsDetailLayout/messages";
import styles from "./TranslationFieldRow.module.css";

interface TranslationFieldRowProps {
  field: TranslationField;
  sourceLanguageCode?: string;
  sourceUsesOriginalLabel: boolean;
  targetLanguageCode: string;
  isEditing: boolean;
  showPerFieldActions: boolean;
  hideFieldActions?: boolean;
  saveDisabled?: boolean;
  disabled: boolean;
  saveButtonState: ConfirmButtonTransitionState;
  richTextResetKey: string;
  onEdit: () => void;
  onDiscard: () => void;
  onSubmit: (data: string | OutputData) => SubmitPromise<any[]>;
  onValueChange?: (value: string) => void;
  fieldError?: string;
}

const renderSourceValue = (
  field: TranslationField,
  richTextResetKey: string,
  disabled: boolean,
  onValueChange?: (value: string) => void,
) => {
  if (field.value === undefined) {
    return <Text color="default2">—</Text>;
  }

  if (field.type === TranslationFieldType.SHORT) {
    return (
      <TranslationFieldsShort
        disabled={disabled}
        edit={false}
        initial={field.value}
        saveButtonState="default"
        onDiscard={() => undefined}
        onSubmit={undefined}
        onValueChange={onValueChange}
      />
    );
  }

  if (field.type === TranslationFieldType.LONG) {
    return (
      <TranslationFieldsLong
        disabled={disabled}
        edit={false}
        initial={field.value}
        saveButtonState="default"
        onDiscard={() => undefined}
        onSubmit={undefined}
        onValueChange={onValueChange}
      />
    );
  }

  return (
    <TranslationFieldsRich
      resetKey={richTextResetKey}
      disabled={disabled}
      edit={false}
      initial={field.value}
      saveButtonState="default"
      onDiscard={() => undefined}
      onSubmit={undefined}
      onValueChange={onValueChange}
    />
  );
};

const renderTranslationInput = (
  field: TranslationField,
  isEditing: boolean,
  hideFieldActions: boolean,
  saveDisabled: boolean,
  disabled: boolean,
  saveButtonState: ConfirmButtonTransitionState,
  richTextResetKey: string,
  onDiscard: () => void,
  onSubmit: (data: string | OutputData) => SubmitPromise,
  onValueChange?: (value: string) => void,
) => {
  const initial = isEditing ? (field.editInitial ?? field.translation) : field.translation;

  if (!isEditing) {
    if (field.type === TranslationFieldType.SHORT) {
      return (
        <TranslationFieldsShort
          disabled={disabled}
          edit={false}
          initial={initial}
          saveButtonState="default"
          onDiscard={onDiscard}
          onSubmit={undefined}
          onValueChange={onValueChange}
        />
      );
    }

    if (field.type === TranslationFieldType.LONG) {
      return (
        <TranslationFieldsLong
          disabled={disabled}
          edit={false}
          initial={initial}
          saveButtonState="default"
          onDiscard={onDiscard}
          onSubmit={undefined}
          onValueChange={onValueChange}
        />
      );
    }

    return (
      <TranslationFieldsRich
        resetKey={richTextResetKey}
        disabled={disabled}
        edit={false}
        initial={initial}
        saveButtonState="default"
        onDiscard={onDiscard}
        onSubmit={undefined}
        onValueChange={onValueChange}
      />
    );
  }

  if (field.type === TranslationFieldType.SHORT) {
    return (
      <TranslationFieldsShort
        disabled={disabled}
        edit
        hideActions={hideFieldActions}
        saveDisabled={saveDisabled}
        initial={initial}
        saveButtonState={saveButtonState}
        onDiscard={onDiscard}
        onSubmit={data => onSubmit(data)}
        onValueChange={onValueChange}
      />
    );
  }

  if (field.type === TranslationFieldType.LONG) {
    return (
      <TranslationFieldsLong
        disabled={disabled}
        edit
        hideActions={hideFieldActions}
        saveDisabled={saveDisabled}
        initial={initial}
        saveButtonState={saveButtonState}
        onDiscard={onDiscard}
        onSubmit={data => onSubmit(data)}
        onValueChange={onValueChange}
      />
    );
  }

  return (
    <TranslationFieldsRich
      resetKey={richTextResetKey}
      disabled={disabled}
      edit
      hideActions={hideFieldActions}
      saveDisabled={saveDisabled}
      initial={initial}
      saveButtonState={saveButtonState}
      onDiscard={onDiscard}
      onSubmit={data => onSubmit(data)}
      onValueChange={onValueChange}
    />
  );
};

export const TranslationFieldRow = ({
  field,
  sourceLanguageCode,
  sourceUsesOriginalLabel,
  targetLanguageCode,
  isEditing,
  showPerFieldActions,
  hideFieldActions = false,
  saveDisabled = false,
  disabled,
  saveButtonState,
  richTextResetKey,
  onEdit,
  onDiscard,
  onSubmit,
  onValueChange,
  fieldError,
}: TranslationFieldRowProps) => {
  const intl = useIntl();
  const isComplete = isFieldTranslationComplete(field.translation, field.type);

  return (
    <Box className={styles.translationFieldRow} data-test-id={`translation-field-${field.name}`}>
      <Box className={styles.fieldColumn}>
        <Box className={styles.fieldHeader}>
          <Box display="flex" flexDirection="column" gap={1} minWidth={0}>
            <Box className={styles.fieldMeta}>
              <span className={styles.langChip}>
                {sourceUsesOriginalLabel || !sourceLanguageCode ? (
                  <FormattedMessage {...translationDetailMessages.originalLabel} />
                ) : (
                  sourceLanguageCode
                )}
              </span>
              <Text fontWeight="medium" size={3}>
                {field.displayName}
              </Text>
            </Box>
            {field.hint && (
              <Text size={2} color="default2">
                {field.hint}
              </Text>
            )}
          </Box>
        </Box>
        <Box className={styles.fieldValue}>
          {renderSourceValue(field, richTextResetKey, disabled, onValueChange)}
        </Box>
      </Box>

      <Box className={styles.fieldColumn}>
        <Box className={styles.fieldHeader}>
          <Box display="flex" flexDirection="column" gap={1} minWidth={0}>
            <Box className={styles.fieldMeta}>
              <span className={styles.langChip}>{targetLanguageCode}</span>
              {!isEditing && (
                <Pill
                  color={isComplete ? "success" : "warning"}
                  size="small"
                  label={intl.formatMessage(
                    isComplete
                      ? translationDetailMessages.translated
                      : translationDetailMessages.needsTranslation,
                  )}
                />
              )}
            </Box>
          </Box>
          {showPerFieldActions && !isEditing && (
            <Button data-test-id={`edit-${field.name}`} onClick={onEdit}>
              <FormattedMessage {...translationDetailMessages.editField} />
            </Button>
          )}
        </Box>
        <Box className={styles.fieldValue}>
          {renderTranslationInput(
            field,
            isEditing,
            hideFieldActions,
            saveDisabled,
            disabled,
            saveButtonState,
            richTextResetKey,
            onDiscard,
            onSubmit,
            onValueChange,
          )}
          {fieldError && (
            <Text size={2} color="critical1" marginTop={2}>
              {fieldError}
            </Text>
          )}
        </Box>
      </Box>
    </Box>
  );
};

TranslationFieldRow.displayName = "TranslationFieldRow";
