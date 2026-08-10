import { DetailSettingsCard } from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";
import RichTextEditor from "@dashboard/components/RichTextEditor";
import { RichTextEditorLoading } from "@dashboard/components/RichTextEditor/RichTextEditorLoading";
import { type DiscoutFormData } from "@dashboard/discounts/types";
import { PromotionTypeEnum } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { useRichTextContext } from "@dashboard/utils/richText/context";
import { Box, Input, Select, Text } from "@saleor/macaw-ui-next";
import { useMemo } from "react";
import { useController, useFormContext } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";

import { discountGeneralInfoMessages as messages } from "./messages";

interface DiscountGeneralInfoProps {
  disabled?: boolean;
  typeDisabled?: boolean;
  error: string | undefined;
}

export const DiscountGeneralInfo = ({
  disabled,
  typeDisabled,
  error,
}: DiscountGeneralInfoProps) => {
  const intl = useIntl();
  const { formState } = useFormContext<DiscoutFormData>();
  const { field: nameField } = useController<DiscoutFormData, "name">({
    name: "name",
  });
  const { field: typeField } = useController<DiscoutFormData, "type">({
    name: "type",
  });
  const { field: descriptionField } = useController<DiscoutFormData, "description">({
    name: "description",
  });
  const { defaultValue, editorRef, isReadyForMount, handleChange } = useRichTextContext();

  const discountTypes = useMemo(
    () => [
      {
        label: intl.formatMessage(messages.catalogType),
        value: PromotionTypeEnum.CATALOGUE,
      },
      {
        label: intl.formatMessage(messages.orderType),
        value: PromotionTypeEnum.ORDER,
      },
    ],
    [intl],
  );

  return (
    <DetailSettingsCard
      data-test-id="discount-general-info-section"
      title={<FormattedMessage {...messages.title} />}
      intro={
        <Text size={3} color="default2">
          <FormattedMessage {...messages.intro} />
        </Text>
      }
    >
      <Box display="grid" gap={3}>
        <Box display="grid" __gridTemplateColumns="250px 1fr" gap={3}>
          <Select
            {...typeField}
            data-test-id="discount-type-select"
            size="medium"
            options={discountTypes}
            label={intl.formatMessage(messages.discountType)}
            disabled={typeDisabled || typeField.disabled}
          />

          <Input
            {...nameField}
            error={!!error || !!formState.errors?.name}
            helperText={error || formState.errors?.name?.message}
            data-test-id="discount-name-input"
            label={intl.formatMessage(messages.discountName)}
            disabled={disabled || nameField.disabled}
          />
        </Box>

        {isReadyForMount ? (
          <RichTextEditor
            defaultValue={defaultValue}
            editorRef={editorRef}
            onChange={data => {
              handleChange();
              descriptionField.onChange(JSON.stringify(data));
            }}
            onBlur={descriptionField.onBlur}
            disabled={disabled ?? false}
            error={false}
            helperText=""
            label={intl.formatMessage(commonMessages.description)}
            name="description"
          />
        ) : (
          <RichTextEditorLoading
            label={intl.formatMessage(commonMessages.description)}
            name="description"
          />
        )}
      </Box>
    </DetailSettingsCard>
  );
};
