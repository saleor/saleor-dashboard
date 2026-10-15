import RichTextEditor from "@dashboard/components/RichTextEditor/RichTextEditor";
import { RichTextEditorLoading } from "@dashboard/components/RichTextEditor/RichTextEditorLoading";
import { commonMessages } from "@dashboard/intl";
import { type UseRichTextResult } from "@dashboard/utils/richText/useRichText";
import { useIntl } from "react-intl";

interface FullDescriptionEditorProps {
  disabled: boolean;
  error: boolean;
  helperText?: string;
  richText: UseRichTextResult;
}

export const FullDescriptionEditor = ({
  disabled,
  error,
  helperText,
  richText,
}: FullDescriptionEditorProps): JSX.Element => {
  const intl = useIntl();
  const label = intl.formatMessage(commonMessages.fullDescription);

  if (!richText.isReadyForMount) {
    return <RichTextEditorLoading label={label} name="fullDescription" />;
  }

  return (
    <RichTextEditor
      defaultValue={richText.defaultValue}
      disabled={disabled}
      editorRef={richText.editorRef}
      error={error}
      helperText={helperText}
      label={label}
      name="fullDescription"
      onChange={richText.handleChange}
    />
  );
};
