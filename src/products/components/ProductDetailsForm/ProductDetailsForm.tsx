// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import RichTextEditor from "@dashboard/components/RichTextEditor";
import { RichTextEditorLoading } from "@dashboard/components/RichTextEditor/RichTextEditorLoading";
import { ProductErrorFragment } from "@dashboard/graphql";
import { FormErrors } from "@dashboard/hooks/useForm";
import { commonMessages } from "@dashboard/intl";
import { getFormErrors, getProductErrorMessage } from "@dashboard/utils/errors";
import { useRichTextContext } from "@dashboard/utils/richText/context";
import { OutputData } from "@editorjs/editorjs";
import { Box, Input } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

interface ProductDetailsFormProps {
  data: {
    description: OutputData;
    name: string;
    rating: number;
  };
  disabled?: boolean;
  errors: ProductErrorFragment[];
  formErrors?: FormErrors<any>;
  onDescriptionChange?: (data: OutputData) => void;
  onChange: (event: any) => any;
}

export const ProductDetailsForm = ({
  data,
  onChange,
  errors,
  formErrors: customFormErrors,
  disabled,
  onDescriptionChange,
}: ProductDetailsFormProps) => {
  const intl = useIntl();
  const graphqlFormErrors = getFormErrors(["name", "description", "rating"], errors);
  const { editorRef, defaultValue, isReadyForMount, handleChange } = useRichTextContext();

  // Merge GraphQL errors with custom form errors (from app extensions)
  const formErrors = {
    name: customFormErrors?.name || graphqlFormErrors.name,
    description: customFormErrors?.description || graphqlFormErrors.description,
    rating: customFormErrors?.rating || graphqlFormErrors.rating,
  };

  // Helper to get error message, handling both custom errors (string/ReactNode) and GraphQL errors
  const getErrorMessage = (error: any): string | React.ReactNode | undefined => {
    if (!error) return undefined;

    if (typeof error === "string") return error;

    if (React.isValidElement(error)) return error;

    return getProductErrorMessage(error, intl);
  };

  // Helper for description field that only returns string (RichTextEditor only accepts string)
  const getDescriptionErrorMessage = (error: any): string | undefined => {
    if (!error) return undefined;

    if (typeof error === "string") return error;

    if (React.isValidElement(error)) return undefined; // Can't render ReactNode in RichTextEditor

    return getProductErrorMessage(error, intl);
  };

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
          helperText={getErrorMessage(formErrors.name)}
        />

        {isReadyForMount ? (
          <RichTextEditor
            editorRef={editorRef}
            defaultValue={defaultValue}
            onChange={event => {
              // We need explicit handler so parent can access data real time
              onDescriptionChange(event);

              handleChange();
            }}
            disabled={disabled}
            error={!!formErrors.description}
            helperText={getDescriptionErrorMessage(formErrors.description)}
            label={intl.formatMessage(commonMessages.description)}
            name="description"
          />
        ) : (
          <RichTextEditorLoading
            label={intl.formatMessage(commonMessages.description)}
            name="description"
          />
        )}
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
            helperText={getErrorMessage(formErrors.rating)}
          />
        </Box>
      </DashboardCard.Content>
    </DashboardCard>
  );
};
