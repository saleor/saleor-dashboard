import { type LanguageFragment } from "@dashboard/graphql";
import { Ripple } from "@dashboard/ripples/components/Ripple";
import { getProgressPercentage, getSectionsProgress } from "@dashboard/translations/progress";
import { rippleTranslationDetailRefresh } from "@dashboard/translations/ripples/translationDetailRefresh";
import { type TranslationSectionConfig } from "@dashboard/translations/types";
import { Box, Text, Toggle } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

import { TranslationProgressBar } from "../TranslationProgressBar/TranslationProgressBar";
import { TranslationProgressCompletePill } from "../TranslationProgressBar/TranslationProgressCompletePill";
import { translationDetailMessages } from "../TranslationsDetailLayout/messages";

interface TranslationContextBarProps {
  sections: TranslationSectionConfig[];
  sourceLanguage: LanguageFragment | null;
  sourceUsesOriginalLabel: boolean;
  targetLanguage: LanguageFragment;
  bulk: boolean;
  onBulkChange: (bulk: boolean) => void;
}

export const TranslationContextBar = ({
  sections,
  sourceLanguage,
  sourceUsesOriginalLabel,
  targetLanguage,
  bulk,
  onBulkChange,
}: TranslationContextBarProps) => {
  const progress = getSectionsProgress(sections);
  const progressPercentage = getProgressPercentage(progress);
  const isComplete = progressPercentage === 100;

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={4}
      paddingY={4}
      paddingX={5}
      borderRadius={4}
      borderWidth={1}
      borderStyle="solid"
      borderColor="default1"
      backgroundColor="default2"
      data-test-id="translation-context-bar"
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        gap={4}
        flexWrap="wrap"
      >
        <Text size={3} color="default2">
          {sourceUsesOriginalLabel || !sourceLanguage ? (
            <FormattedMessage
              {...translationDetailMessages.translatingTo}
              values={{
                targetLanguage: targetLanguage.language,
              }}
            />
          ) : (
            <FormattedMessage
              {...translationDetailMessages.translatingFromTo}
              values={{
                sourceLanguage: sourceLanguage.language,
                targetLanguage: targetLanguage.language,
              }}
            />
          )}
        </Text>
        <Box display="flex" alignItems="center" gap={3} position="relative">
          <Text size={3} fontWeight="medium">
            <FormattedMessage {...translationDetailMessages.editInBulk} />
          </Text>
          <Toggle pressed={bulk} onPressedChange={onBulkChange} />
          <Box position="absolute" __top="-8px" __right="-8px">
            <Ripple model={rippleTranslationDetailRefresh} />
          </Box>
        </Box>
      </Box>
      <Box display="flex" alignItems="center" gap={4} width="100%">
        {!isComplete ? (
          <>
            <Box __flex={1} __minWidth={0} display="flex" alignItems="center">
              <TranslationProgressBar percentage={progressPercentage} />
            </Box>
            <Box
              borderLeftStyle="solid"
              borderColor="default1"
              borderLeftWidth={1}
              paddingLeft={4}
              display="flex"
              flexDirection="column"
              alignItems="flex-end"
              gap={0.5}
              flexShrink="0"
            >
              <Text size={2} color="default2" __whiteSpace="nowrap">
                <FormattedMessage
                  {...translationDetailMessages.fieldsTranslated}
                  values={{
                    completed: progress.completed,
                    total: progress.total,
                  }}
                />
              </Text>
              <Text size={4} fontWeight="medium" __whiteSpace="nowrap">
                {progressPercentage}%
              </Text>
            </Box>
          </>
        ) : (
          <Box display="flex" alignItems="center" gap={3} marginLeft="auto" flexShrink="0">
            <Box __width="48px" display="flex" alignItems="center" justifyContent="center">
              <TranslationProgressCompletePill data-test-id="translation-progress-bar" />
            </Box>
            <Box
              borderLeftStyle="solid"
              borderColor="default1"
              borderLeftWidth={1}
              paddingLeft={3}
              display="flex"
              flexDirection="column"
              alignItems="flex-end"
              gap={0.5}
            >
              <Text size={2} color="default2" __whiteSpace="nowrap">
                <FormattedMessage
                  {...translationDetailMessages.fieldsTranslated}
                  values={{
                    completed: progress.completed,
                    total: progress.total,
                  }}
                />
              </Text>
              <Text size={4} fontWeight="medium" __whiteSpace="nowrap">
                {progressPercentage}%
              </Text>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

TranslationContextBar.displayName = "TranslationContextBar";
