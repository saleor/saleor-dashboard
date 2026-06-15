import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import { SendFormKeyboardShortcutHint } from "@dashboard/components/SendFormKeyboardShortcutHint/SendFormKeyboardShortcutHint";
import { type SubmitPromise } from "@dashboard/hooks/useForm";
import { createCmdEnterSubmitHandler } from "@dashboard/utils/cmdEnterSubmit";
import { TextField } from "@material-ui/core";
import { Box, Text } from "@saleor/macaw-ui-next";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { translationDetailMessages } from "../TranslationsDetailLayout/messages";
import TranslationFieldsSave from "./TranslationFieldsSave";

interface TranslationFieldsLongProps {
  disabled: boolean;
  edit: boolean;
  hideActions?: boolean;
  saveDisabled?: boolean;
  initial: string | null;
  saveButtonState: ConfirmButtonTransitionState;
  onDiscard: () => void;
  onSubmit?: (data: string) => SubmitPromise;
  onValueChange?(newValue: string): void;
}

const TranslationFieldsLong = ({
  disabled,
  edit,
  hideActions = false,
  saveDisabled = false,
  initial,
  saveButtonState,
  onDiscard,
  onSubmit,
  onValueChange,
}: TranslationFieldsLongProps) => {
  const intl = useIntl();
  const [isFocused, setIsFocused] = useState(false);
  const showShortcut = !hideActions;

  return edit ? (
    <Form
      confirmLeave={false}
      initial={{ translation: initial }}
      onSubmit={data => (onSubmit ? onSubmit(data.translation ?? "") : Promise.resolve([]))}
    >
      {({ change, data, submit }) => {
        const canSubmitWithShortcut =
          showShortcut && !disabled && !saveDisabled && saveButtonState !== "loading";
        const handleCmdEnterSubmit = createCmdEnterSubmitHandler(submit, canSubmitWithShortcut);

        return (
          <div>
            <Box position="relative">
              <TextField
                disabled={disabled}
                fullWidth
                multiline
                label={intl.formatMessage({
                  id: "/vCXIP",
                  defaultMessage: "Translation",
                })}
                name="translation"
                value={data.translation || ""}
                data-test-id="translation-field"
                onChange={event => {
                  change(event);

                  if (onValueChange) {
                    onValueChange(event.target.value);
                  }
                }}
                onKeyDown={handleCmdEnterSubmit}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
              {showShortcut && (
                <Box position="absolute" __bottom="8px" __right="8px">
                  <SendFormKeyboardShortcutHint visible={isFocused} action="save" />
                </Box>
              )}
            </Box>
            {!hideActions && (
              <TranslationFieldsSave
                saveButtonState={saveButtonState}
                saveDisabled={saveDisabled}
                onDiscard={onDiscard}
                onSave={submit}
              />
            )}
          </div>
        );
      }}
    </Form>
  ) : initial === null ? (
    <Text color="default2">
      <FormattedMessage {...translationDetailMessages.noTranslationYet} />
    </Text>
  ) : (
    <Text>{initial}</Text>
  );
};

TranslationFieldsLong.displayName = "TranslationFieldsLong";
export default TranslationFieldsLong;
