// @ts-strict-ignore
import { DetailSettingsCard } from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";
import FormSpacer from "@dashboard/components/FormSpacer";
import RichTextEditor from "@dashboard/components/RichTextEditor/RichTextEditor";
import { RichTextEditorClamp } from "@dashboard/components/RichTextEditor/RichTextEditorClamp";
import { RichTextEditorLoading } from "@dashboard/components/RichTextEditor/RichTextEditorLoading";
import { type ProductErrorFragment } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { getFormErrors, getProductErrorMessage } from "@dashboard/utils/errors";
import createNonNegativeValueChangeHandler from "@dashboard/utils/handlers/nonNegativeValueChangeHandler";
import { useRichTextContext } from "@dashboard/utils/richText/context";
import { type OutputData } from "@editorjs/editorjs";
import { Box, Input, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

interface ProductDetailsFormProps {
  data: {
    description: OutputData;
    name: string;
    rating: number | null;
  };
  /** Simple products carry weight here. Variants keep it on the variant. */
  shippingWeight?: {
    value: string;
  };
  disabled?: boolean;
  errors: ProductErrorFragment[];
  onDescriptionChange?: (data: OutputData) => void;
  onChange: (event: any) => any;
}

export const ProductDetailsForm = ({
  data,
  shippingWeight,
  onChange,
  errors,
  disabled,
  onDescriptionChange,
}: ProductDetailsFormProps) => {
  const intl = useIntl();
  const formErrors = getFormErrors(["name", "description", "rating", "weight"], errors);
  const { editorRef, defaultValue, isReadyForMount, handleChange } = useRichTextContext();
  const handleWeightChange = createNonNegativeValueChangeHandler(onChange);

  return (
    <DetailSettingsCard
      title={intl.formatMessage(commonMessages.generalInformations)}
      data-test-id="product-general-settings"
    >
      <Input
        label={intl.formatMessage({
          id: "6AMFki",
          defaultMessage: "Name",
          description: "product name",
        })}
        size="small"
        value={data.name || ""}
        onChange={onChange}
        error={!!formErrors.name}
        name="name"
        disabled={disabled}
        helperText={getProductErrorMessage(formErrors.name, intl)}
      />
      <FormSpacer />

      {isReadyForMount ? (
        <RichTextEditorClamp tall>
          <RichTextEditor
            editorRef={editorRef}
            defaultValue={defaultValue}
            onChange={event => {
              // We need explicit handler so parent can access data real time
              if (onDescriptionChange) {
                onDescriptionChange(event);
              }

              handleChange();
            }}
            disabled={disabled}
            error={!!formErrors.description}
            helperText={getProductErrorMessage(formErrors.description, intl)}
            label={intl.formatMessage(commonMessages.description)}
            name="description"
          />
        </RichTextEditorClamp>
      ) : (
        <RichTextEditorLoading
          label={intl.formatMessage(commonMessages.description)}
          name="description"
        />
      )}
      <FormSpacer />
      <Box display="flex" alignItems="flex-end" gap={4} flexWrap="wrap">
        <Box __width="16rem" flexShrink="0">
          <Input
            label={intl.formatMessage({
              id: "L7N+0y",
              defaultMessage: "Product Rating",
              description: "product rating",
            })}
            size="small"
            value={data.rating || ""}
            onChange={onChange}
            error={!!formErrors.rating}
            name="rating"
            type="number"
            disabled={disabled}
            data-test-id="product-rating"
            helperText={getProductErrorMessage(formErrors.rating, intl)}
          />
        </Box>
        {shippingWeight ? (
          <>
            <Box __width="16rem" flexShrink="0">
              <Input
                label={intl.formatMessage({
                  id: "okGo4U",
                  defaultMessage: "Shipping weight",
                  description: "simple product weight used for shipping rates",
                })}
                size="small"
                value={shippingWeight.value}
                onChange={handleWeightChange}
                error={!!formErrors.weight}
                name="weight"
                type="number"
                disabled={disabled}
                data-test-id="product-shipping-weight"
                helperText={getProductErrorMessage(formErrors.weight, intl)}
              />
            </Box>
            {!formErrors.weight ? (
              <Text size={2} color="default2" flexShrink="0" whiteSpace="nowrap" marginBottom={2}>
                {intl.formatMessage({
                  id: "Y2B0j0",
                  defaultMessage: "Used to calculate shipping rates.",
                  description: "helper beside the simple product shipping weight field",
                })}
              </Text>
            ) : null}
          </>
        ) : null}
      </Box>
    </DetailSettingsCard>
  );
};
