// @ts-strict-ignore
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import RichTextEditor from "@dashboard/components/RichTextEditor";
import RichTextEditorContent from "@dashboard/components/RichTextEditor/RichTextEditorContent";
import { RichTextEditorLoading } from "@dashboard/components/RichTextEditor/RichTextEditorLoading";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import { OutputData } from "@editorjs/editorjs";
import { Text } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

import TranslationFieldsSave from "./TranslationFieldsSave";
import { useRichTextSubmit } from "./useRichTextSubmit";

interface TranslationFieldsRichProps {
  disabled: boolean;
  edit: boolean;
  initial: string;
  saveButtonState: ConfirmButtonTransitionState;
  resetKey: string;
  onDiscard: () => void;
  onSubmit: (data: OutputData) => SubmitPromise;
  onValueChange?(newValue: string): void;
}

const TranslationFieldsRich = ({
  disabled,
  edit,
  initial,
  saveButtonState,
  resetKey,
  onDiscard,
  onSubmit,
  onValueChange,
}: TranslationFieldsRichProps) => {
  const intl = useIntl();
  const { isReadyForMount, handleSubmit, defaultValue, handleChange, editorRef } =
    useRichTextSubmit(initial, onSubmit, disabled);

  return edit ? (
    <form onSubmit={handleSubmit}>
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
      <TranslationFieldsSave
        saveButtonState={saveButtonState}
        onDiscard={onDiscard}
        onSave={handleSubmit}
      />
    </form>
  ) : initial === null ? (
    <Text color="default2">
      <FormattedMessage id="T/5OyA" defaultMessage="No translation yet" />
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
