import RichTextEditor from "@dashboard/components/RichTextEditor";
import { useRichTextContext } from "@dashboard/utils/richText/context";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";

export const RuleDescription = () => {
  const { defaultValue, editorRef, isReadyForMount, handleChange } =
    useRichTextContext();

  return (
    <Box>
      <Text marginBottom={4} as="p">
        Description
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
