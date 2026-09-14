// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import RichTextEditor from "@dashboard/components/RichTextEditor/RichTextEditor";
import { RichTextEditorLoading } from "@dashboard/components/RichTextEditor/RichTextEditorLoading";
import { type ProductErrorFragment } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { getFormErrors, getProductErrorMessage } from "@dashboard/utils/errors";
import { useRichTextContext } from "@dashboard/utils/richText/context";
import { type OutputData } from "@editorjs/editorjs";
import { Box, Chip, Input, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

interface ProductDetailsFormProps {
  data: {
    description: OutputData;
    name: string;
    rating: number;
  };
  disabled?: boolean;
  errors: ProductErrorFragment[];
  onDescriptionChange?: (data: OutputData) => void;
  onChange: (event: any) => any;
}

export const ProductDetailsForm = ({
  data,
  onChange,
  errors,
  disabled,
  onDescriptionChange,
}: ProductDetailsFormProps) => {
  const intl = useIntl();
  const formErrors = getFormErrors(["name", "description", "rating"], errors);
  const { editorRef, defaultValue, isReadyForMount, handleChange } = useRichTextContext();

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage(commonMessages.generalInformations)}
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content display="grid" gap={2}>
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

        {isReadyForMount ? (
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
        ) : (
          <RichTextEditorLoading
            label={intl.formatMessage(commonMessages.description)}
            name="description"
          />
        )}
        <Box display="flex" flexDirection="column" gap={2} marginTop={3}>
          <Chip
            backgroundColor="warning1"
            borderColor="warning1"
            color="warning1"
            size="small"
            alignSelf="start"
            __paddingX="8px"
            __paddingY="4px"
            data-test-id="product-rating-deprecated-badge"
          >
            {intl.formatMessage(commonMessages.deprecated)}
          </Chip>
          <Box __width="25%">
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
              helperText={getProductErrorMessage(formErrors.rating, intl)}
            />
          </Box>
          <Text size={2} color="warning1">
            {intl.formatMessage({
              id: "mTr+ZM",
              defaultMessage:
                'Product rating will be removed from the API. Create a numeric "rating" attribute instead.',
              description: "hint explaining why a field is deprecated",
            })}
          </Text>
        </Box>
      </DashboardCard.Content>
    </DashboardCard>
  );
};
