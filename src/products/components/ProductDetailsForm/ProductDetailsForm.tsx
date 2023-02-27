import CardTitle from "@dashboard/components/CardTitle";
import FormSpacer from "@dashboard/components/FormSpacer";
import Grid from "@dashboard/components/Grid";
import Hr from "@dashboard/components/Hr";
import RichTextEditor from "@dashboard/components/RichTextEditor";
import { RichTextEditorLoading } from "@dashboard/components/RichTextEditor/RichTextEditorLoading";
import { ProductErrorFragment } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { getFormErrors, getProductErrorMessage } from "@dashboard/utils/errors";
import { useRichTextContext } from "@dashboard/utils/richText/context";
import { OutputData } from "@editorjs/editorjs";
import { Card, CardContent, TextField } from "@material-ui/core";
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

  onChange(event: any);
}

export const ProductDetailsForm: React.FC<ProductDetailsFormProps> = ({
  data,
  disabled,
  errors,
  onChange,
}) => {
  const intl = useIntl();
  const { editorRef, defaultValue, isReadyForMount, handleChange } = useRichTextContext();

  const formErrors = getFormErrors(["name", "description", "rating"], errors);

  return (
    <Card>
      <CardTitle title={intl.formatMessage(commonMessages.generalInformations)} />
      <CardContent>
        <TextField
          error={!!formErrors.name}
          helperText={getProductErrorMessage(formErrors.name, intl)}
          fullWidth
          label={intl.formatMessage({
            id: "6AMFki",
            defaultMessage: "Name",
            description: "product name",
          })}
          name="name"
          value={data.name}
          onChange={onChange}
        />
        <FormSpacer />
        {isReadyForMount ? (
          <RichTextEditor
            editorRef={editorRef}
            defaultValue={defaultValue}
            onChange={handleChange}
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
        <FormSpacer />
        <Hr />
        <FormSpacer />
        <Grid variant="uniform">
          <TextField
            type="number"
            error={!!formErrors.rating}
            helperText={getProductErrorMessage(formErrors.rating, intl)}
            disabled={disabled}
            label={intl.formatMessage({
              id: "L7N+0y",
              defaultMessage: "Product Rating",
              description: "product rating",
            })}
            name="rating"
            value={data.rating || ""}
            onChange={onChange}
          />
        </Grid>
      </CardContent>
    </Card>
  );
};
export default ProductDetailsForm;
