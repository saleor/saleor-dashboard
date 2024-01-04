import RichTextEditor from "@dashboard/components/RichTextEditor";
import { RichTextEditorLoading } from "@dashboard/components/RichTextEditor/RichTextEditorLoading";
import { Rule } from "@dashboard/discounts/models";
import { commonMessages } from "@dashboard/intl";
import { useRichTextContext } from "@dashboard/utils/richText/context";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { useController } from "react-hook-form";
import { useIntl } from "react-intl";

import { RuleInputWrapper } from "../RuleInputWrapper/RuleInputWrapper";

interface RuleDescriptionProps {
  disabled?: boolean;
  error?: boolean;
}

export const RuleDescription = ({
  disabled = false,
  error = false,
}: RuleDescriptionProps) => {
  const intl = useIntl();
  const { defaultValue, editorRef, isReadyForMount, handleChange } =
    useRichTextContext();

  const { field } = useController<Rule, "description">({
    name: "description",
  });

  return (
    <Box overflow="hidden">
      <Text marginBottom={2} as="p">
        {intl.formatMessage(commonMessages.description)}
      </Text>

      <RuleInputWrapper>
        {isReadyForMount ? (
          <RichTextEditor
            defaultValue={defaultValue}
            editorRef={editorRef}
            onChange={data => {
              handleChange();
              field.onChange(JSON.stringify(data));
            }}
            onBlur={field.onBlur}
            disabled={disabled}
            error={error}
            helperText=""
            label=" "
            name="rule-description"
          />
        ) : (
          <RichTextEditorLoading label="" name="description" />
        )}
      </RuleInputWrapper>
    </Box>
  );
};
