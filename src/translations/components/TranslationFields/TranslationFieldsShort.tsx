import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import { SendFormKeyboardShortcutHint } from "@dashboard/components/SendFormKeyboardShortcutHint/SendFormKeyboardShortcutHint";
import { type SubmitPromise } from "@dashboard/hooks/useForm";
import {
  createCmdEnterSubmitHandler,
  preventPlainEnterSubmit,
} from "@dashboard/utils/cmdEnterSubmit";
import { TextField } from "@material-ui/core";
import { Box, Text } from "@saleor/macaw-ui-next";
import { type KeyboardEventHandler, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { translationDetailMessages } from "../TranslationsDetailLayout/messages";
import TranslationFieldsSave from "./TranslationFieldsSave";

interface TranslationFieldsShortProps {
  disabled: boolean;
  edit: boolean;
  hideActions?: boolean;
  saveDisabled?: boolean;
  initial: string | null;
  saveButtonState: ConfirmButtonTransitionState;
  onDiscard: () => void;
  onSubmit?: (data: string) => SubmitPromise<any[]>;
  // todo add to every field
  onValueChange?(newValue: string): void;
}

const TranslationFieldsShort = ({
  disabled,
  edit,
  hideActions = false,
  saveDisabled = false,
  initial,
  saveButtonState,
  onDiscard,
  onSubmit,
  onValueChange,
}: TranslationFieldsShortProps) => {
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
        const handleKeyDown: KeyboardEventHandler = event => {
          preventPlainEnterSubmit(event, hideActions);
          handleCmdEnterSubmit(event);
        };

        return (
          <div>
            <Box position="relative">
              <TextField
                disabled={disabled}
                fullWidth
                label={intl.formatMessage({
                  id: "/vCXIP",
                  defaultMessage: "Translation",
                })}
                name="translation"
                data-test-id="translation-field"
                value={data.translation || ""}
                onChange={event => {
                  change(event);

                  if (onValueChange) {
                    onValueChange(event.target.value);
                  }
                }}
                onKeyDown={handleKeyDown}
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

TranslationFieldsShort.displayName = "TranslationFieldsShort";
export default TranslationFieldsShort;
