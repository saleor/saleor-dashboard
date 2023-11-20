import RichTextEditor from "@dashboard/components/RichTextEditor";
import { DiscoutFormData } from "@dashboard/discounts/types";
import { commonMessages } from "@dashboard/intl";
import { useRichTextContext } from "@dashboard/utils/richText/context";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { useController } from "react-hook-form";
import { useIntl } from "react-intl";

export const RuleDescription = ({ index }: { index: number }) => {
  const intl = useIntl();
  const { defaultValue, editorRef, isReadyForMount, handleChange } =
    useRichTextContext();

  const { field } = useController<
    DiscoutFormData,
    `rules.${number}.description`
  >({
    name: `rules.${index}.description`,
  });

  return (
    <Box>
      <Text marginBottom={4} as="p">
        {intl.formatMessage(commonMessages.description)}
      </Text>
      <RichTextEditor
        defaultValue={defaultValue}
        editorRef={editorRef}
        onChange={data => {
          handleChange();
          field.onChange(JSON.stringify(data));
        }}
        onBlur={field.onBlur}
        name="description"
        label="Optional"
        disabled={!isReadyForMount}
        error={false}
        helperText=""
      />
    </Box>
  );
};
