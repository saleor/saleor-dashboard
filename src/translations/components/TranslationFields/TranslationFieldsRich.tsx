// @ts-strict-ignore
import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import RichTextEditor from "@dashboard/components/RichTextEditor";
import RichTextEditorContent from "@dashboard/components/RichTextEditor/RichTextEditorContent";
import { RichTextEditorLoading } from "@dashboard/components/RichTextEditor/RichTextEditorLoading";
import { SendFormKeyboardShortcutHint } from "@dashboard/components/SendFormKeyboardShortcutHint/SendFormKeyboardShortcutHint";
import { type SubmitPromise } from "@dashboard/hooks/useForm";
import { createCmdEnterSubmitHandler } from "@dashboard/utils/cmdEnterSubmit";
import { type OutputData } from "@editorjs/editorjs";
import { Box, Text } from "@saleor/macaw-ui-next";
import { useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { translationDetailMessages } from "../TranslationsDetailLayout/messages";
import TranslationFieldsSave from "./TranslationFieldsSave";
import { useRichTextSubmit } from "./useRichTextSubmit";

interface TranslationFieldsRichProps {
  disabled: boolean;
  edit: boolean;
  hideActions?: boolean;
  saveDisabled?: boolean;
  initial: string | null;
  saveButtonState: ConfirmButtonTransitionState;
  resetKey: string;
  onDiscard: () => void;
  onSubmit?: (data: OutputData) => SubmitPromise;
  onValueChange?(newValue: string): void;
}

const TranslationFieldsRich = ({
  disabled,
  edit,
  hideActions = false,
  saveDisabled = false,
  initial,
  saveButtonState,
  resetKey,
  onDiscard,
  onSubmit,
  onValueChange,
}: TranslationFieldsRichProps) => {
  const intl = useIntl();
  const [isFocused, setIsFocused] = useState(false);
  const showShortcut = !hideActions;
  const { isReadyForMount, handleSubmit, defaultValue, handleChange, editorRef } =
    useRichTextSubmit(initial ?? "", onSubmit ?? (async () => []), disabled, false);
  const canSubmitWithShortcut =
    showShortcut && !disabled && !saveDisabled && saveButtonState !== "loading";
  const handleCmdEnterSubmit = useMemo(
    () =>
      createCmdEnterSubmitHandler(() => {
        void handleSubmit();
      }, canSubmitWithShortcut),
    [canSubmitWithShortcut, handleSubmit],
  );

  return edit ? (
    <form
      onSubmit={event => {
        event.preventDefault();
        void handleSubmit();
      }}
    >
      <Box position="relative">
        {isReadyForMount ? (
          <RichTextEditor
            defaultValue={defaultValue}
            editorRef={editorRef}
            onChange={changeEvent => {
              handleChange();

              if (onValueChange) {
                onValueChange(JSON.stringify(changeEvent));
              }
            }}
            disabled={disabled}
            error={undefined}
            helperText={undefined}
            label={intl.formatMessage({
              id: "/vCXIP",
              defaultMessage: "Translation",
            })}
            name="translation"
            data-test-id="translation-field"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDownCapture={handleCmdEnterSubmit}
          />
        ) : (
          <RichTextEditorLoading
            label={intl.formatMessage({
              id: "/vCXIP",
              defaultMessage: "Translation",
            })}
            name="translation"
            data-test-id="translation-field"
          />
        )}
        {showShortcut && (
          <Box position="absolute" __bottom="8px" __right="8px" zIndex="3">
            <SendFormKeyboardShortcutHint visible={isFocused} action="save" />
          </Box>
        )}
      </Box>
      {!hideActions && (
        <TranslationFieldsSave
          saveButtonState={saveButtonState}
          saveDisabled={saveDisabled}
          onDiscard={onDiscard}
          onSave={handleSubmit}
        />
      )}
    </form>
  ) : initial === null ? (
    <Text color="default2">
      <FormattedMessage {...translationDetailMessages.noTranslationYet} />
    </Text>
  ) : (
    <Text>
      {isReadyForMount && (
        <RichTextEditorContent key={resetKey + "_" + defaultValue?.time} value={defaultValue} />
      )}
    </Text>
  );
};

TranslationFieldsRich.displayName = "TranslationFieldsRich";
export default TranslationFieldsRich;
