import RichTextEditor from "@dashboard/components/RichTextEditor";
import { commonMessages } from "@dashboard/intl";
import { useRichTextContext } from "@dashboard/utils/richText/context";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

export const RuleDescription = () => {
  const intl = useIntl();
  const { defaultValue, editorRef, isReadyForMount, handleChange } =
    useRichTextContext();

  return (
    <Box>
      <Text marginBottom={4} as="p">
        {intl.formatMessage(commonMessages.description)}
      </Text>
      <RichTextEditor
        defaultValue={defaultValue}
        editorRef={editorRef}
        onChange={handleChange}
        name="description"
        label=""
        disabled={!isReadyForMount}
        error={false}
        helperText=""
      />
    </Box>
  );
};
