import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import { Title2 } from "@dashboard/components/Title2/Title2";
import { type SubmitPromise } from "@dashboard/hooks/useForm";
import { getFieldsProgress, getProgressPercentage } from "@dashboard/translations/progress";
import {
  type TranslationField,
  type TranslationSectionConfig,
} from "@dashboard/translations/types";
import { type OutputData } from "@editorjs/editorjs";
import { Box, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

import { TranslationFieldRow } from "../TranslationFieldRow/TranslationFieldRow";
import { TranslationGroupBox } from "../TranslationGroupBox/TranslationGroupBox";
import { TranslationProgressBar } from "../TranslationProgressBar/TranslationProgressBar";
import { TranslationProgressCompletePill } from "../TranslationProgressBar/TranslationProgressCompletePill";
import { translationDetailMessages } from "../TranslationsDetailLayout/messages";
import styles from "./TranslationSection.module.css";

interface TranslationSectionProps {
  section: TranslationSectionConfig;
  sourceLanguageCode?: string;
  sourceUsesOriginalLabel: boolean;
  targetLanguageCode: string;
  targetLanguageLabel: string;
  bulk: boolean;
  activeField?: string | string[];
  disabled: boolean;
  isFieldDirty: (field: TranslationField) => boolean;
  saveButtonState: ConfirmButtonTransitionState;
  richTextResetKey: string;
  initialExpanded?: boolean;
  onEdit: (fieldName: string) => void;
  onDiscard: (fieldName?: string) => void;
  onSubmit: (field: TranslationField, data: string | OutputData) => SubmitPromise;
  onValueChange?: (field: TranslationField, value: string) => void;
  fieldErrors?: Record<string, string>;
}

export const TranslationSection = ({
  section,
  sourceLanguageCode,
  sourceUsesOriginalLabel,
  targetLanguageCode,
  targetLanguageLabel,
  bulk,
  activeField,
  disabled,
  isFieldDirty,
  saveButtonState,
  richTextResetKey,
  initialExpanded = true,
  onEdit,
  onDiscard,
  onSubmit,
  onValueChange,
  fieldErrors = {},
}: TranslationSectionProps) => {
  const progress = getFieldsProgress(section.fields);
  const progressPercentage = getProgressPercentage(progress);
  const isComplete = progressPercentage === 100;

  const isFieldEditing = (fieldName: string) => {
    if (bulk) {
      return true;
    }

    if (!activeField) {
      return false;
    }

    if (Array.isArray(activeField)) {
      return activeField.includes(fieldName);
    }

    return activeField === fieldName;
  };

  if (section.fields.length === 0) {
    return null;
  }

  return (
    <TranslationGroupBox
      groupId={section.id}
      defaultExpanded={initialExpanded}
      dataTestId={`translation-section-${section.id}`}
      headerStart={
        <Box display="flex" flexDirection="column" gap={0.5}>
          <Title2>{section.title}</Title2>
          {section.subtitle && (
            <Text size={2} color="default2">
              {section.subtitle}
            </Text>
          )}
        </Box>
      }
      headerEnd={
        <Box display="flex" alignItems="center" gap={isComplete ? 3 : 4}>
          <Box
            borderRightStyle="solid"
            borderColor="default1"
            borderRightWidth={1}
            paddingRight={isComplete ? 3 : 4}
            display="flex"
            flexDirection="column"
            alignItems="flex-end"
            gap={0.5}
          >
            <Text size={2} color="default2">
              <FormattedMessage
                {...translationDetailMessages.fieldsTranslated}
                values={{
                  completed: progress.completed,
                  total: progress.total,
                }}
              />
            </Text>
            <Text size={3} fontWeight="medium">
              {progressPercentage}%
            </Text>
          </Box>
          {isComplete ? (
            <Box __width="48px" display="flex" alignItems="center" justifyContent="center">
              <TranslationProgressCompletePill />
            </Box>
          ) : (
            <Box __width="96px" display="flex" alignItems="center" justifyContent="center">
              <TranslationProgressBar percentage={progressPercentage} />
            </Box>
          )}
        </Box>
      }
    >
      <Box className={styles.columnHeaderRow}>
        <Text size={2} color="default2" fontWeight="medium">
          {sourceUsesOriginalLabel || !sourceLanguageCode ? (
            <FormattedMessage {...translationDetailMessages.originalLabel} />
          ) : (
            sourceLanguageCode
          )}
        </Text>
        <Text size={2} color="default2" fontWeight="medium">
          {targetLanguageLabel}
        </Text>
      </Box>
      <Box className={styles.fieldRows}>
        {section.fields.map(field => (
          <TranslationFieldRow
            key={field.name}
            field={field}
            sourceLanguageCode={sourceLanguageCode}
            sourceUsesOriginalLabel={sourceUsesOriginalLabel}
            targetLanguageCode={targetLanguageCode}
            isEditing={isFieldEditing(field.name)}
            showPerFieldActions={!bulk}
            hideFieldActions={bulk}
            saveDisabled={!bulk && isFieldEditing(field.name) && !isFieldDirty(field)}
            disabled={disabled}
            saveButtonState={saveButtonState}
            richTextResetKey={richTextResetKey}
            onEdit={() => onEdit(field.name)}
            onDiscard={() => onDiscard(field.name)}
            onSubmit={data => onSubmit(field, data)}
            onValueChange={onValueChange ? value => onValueChange(field, value) : undefined}
            fieldError={fieldErrors[field.name]}
          />
        ))}
      </Box>
      {section.pagination && (
        <Box
          paddingX={5}
          paddingY={3}
          borderTopStyle="solid"
          borderColor="default1"
          borderTopWidth={1}
        >
          <TablePaginationWithContext
            colSpan={1}
            settings={section.pagination.settings}
            onUpdateListSettings={section.pagination.onUpdateListSettings}
            component="div"
          />
        </Box>
      )}
    </TranslationGroupBox>
  );
};

TranslationSection.displayName = "TranslationSection";
