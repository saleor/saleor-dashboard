import RichTextEditor from "@dashboard/components/RichTextEditor";
import { RichTextEditorLoading } from "@dashboard/components/RichTextEditor/RichTextEditorLoading";
import { useDiscountRulesContext } from "@dashboard/discounts/components/DiscountRules/context";
import { type Rule } from "@dashboard/discounts/models";
import { commonMessages } from "@dashboard/intl";
import { useRichTextContext } from "@dashboard/utils/richText/context";
import { useController } from "react-hook-form";
import { useIntl } from "react-intl";

import { RuleInputWrapper } from "../RuleInputWrapper/RuleInputWrapper";

interface RuleDescriptionProps {
  error?: boolean;
}

export const RuleDescription = ({ error = false }: RuleDescriptionProps) => {
  const intl = useIntl();
  const { disabled } = useDiscountRulesContext();
  const { defaultValue, editorRef, isReadyForMount, handleChange } = useRichTextContext();
  const { field } = useController<Rule, "description">({
    name: "description",
  });

  return (
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
          label={intl.formatMessage(commonMessages.description)}
          name="rule-description"
        />
      ) : (
        <RichTextEditorLoading
          label={intl.formatMessage(commonMessages.description)}
          name="description"
        />
      )}
    </RuleInputWrapper>
  );
};
