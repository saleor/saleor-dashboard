import { DashboardCard } from "@dashboard/components/Card";
import RichTextEditor from "@dashboard/components/RichTextEditor";
import { RichTextEditorLoading } from "@dashboard/components/RichTextEditor/RichTextEditorLoading";
import { type DiscoutFormData } from "@dashboard/discounts/types";
import { PromotionTypeEnum } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { useRichTextContext } from "@dashboard/utils/richText/context";
import { Box, Input, Select } from "@saleor/macaw-ui-next";
import { useMemo } from "react";
import { useController, useFormContext } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";

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
        label: intl.formatMessage({
          defaultMessage: "Catalog",
          id: "GOdq5V",
        }),
        value: PromotionTypeEnum.CATALOGUE,
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Order",
          id: "XPruqs",
        }),
        value: PromotionTypeEnum.ORDER,
      },
    ],
    [intl],
  );

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          <FormattedMessage defaultMessage="General information" id="fKrRhF" />
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content display="grid" gap={2}>
        <Box display="grid" __gridTemplateColumns="250px 1fr" gap={3}>
          <Select
            {...typeField}
            data-test-id="discount-type-select"
            size="medium"
            options={discountTypes}
            label={intl.formatMessage({
              defaultMessage: "Discount type",
              id: "z/2AZY",
            })}
            disabled={typeDisabled || typeField.disabled}
          />

          <Input
            {...nameField}
            error={!!error || !!formState.errors?.name}
            helperText={error || formState.errors?.name?.message}
            data-test-id="discount-name-input"
            label={intl.formatMessage({
              defaultMessage: "Discount name",
              id: "gK7mIl",
            })}
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
      </DashboardCard.Content>
    </DashboardCard>
  );
};
