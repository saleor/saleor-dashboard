import RichTextEditor from "@dashboard/components/RichTextEditor/RichTextEditor";
import { RichTextEditorLoading } from "@dashboard/components/RichTextEditor/RichTextEditorLoading";
import { commonMessages } from "@dashboard/intl";
import { Ripple } from "@dashboard/ripples/components/Ripple";
import { type Ripple as RippleModel } from "@dashboard/ripples/types";
import { type UseRichTextResult } from "@dashboard/utils/richText/useRichText";
import { Box } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

interface FullDescriptionEditorProps {
  disabled: boolean;
  error: boolean;
  helperText?: string;
  ripple?: RippleModel;
  richText: UseRichTextResult;
}

export const FullDescriptionEditor = ({
  disabled,
  error,
  helperText,
  ripple,
  richText,
}: FullDescriptionEditorProps): JSX.Element => {
  const intl = useIntl();
  const label = intl.formatMessage(commonMessages.fullDescription);

  return (
    <Box position="relative">
      {richText.isReadyForMount ? (
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
      ) : (
        <RichTextEditorLoading label={label} name="fullDescription" />
      )}
      {ripple && (
        <Box
          position="absolute"
          top={2}
          right={2}
          zIndex="3"
          data-test-id="full-description-ripple"
        >
          <Ripple model={ripple} />
        </Box>
      )}
    </Box>
  );
};
