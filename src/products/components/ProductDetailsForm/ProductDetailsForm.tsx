import { OutputData } from "@editorjs/editorjs";
import { Card, CardContent, TextField } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import FormSpacer from "@saleor/components/FormSpacer";
import Grid from "@saleor/components/Grid";
import Hr from "@saleor/components/Hr";
import RichTextEditor, {
  RichTextEditorChange
} from "@saleor/components/RichTextEditor";
import { ProductErrorFragment } from "@saleor/graphql";
import { commonMessages } from "@saleor/intl";
import { getFormErrors, getProductErrorMessage } from "@saleor/utils/errors";
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

  onDescriptionChange: RichTextEditorChange;
  onChange(event: any);
}

export const ProductDetailsForm: React.FC<ProductDetailsFormProps> = ({
  data,
  disabled,
  errors,
  onDescriptionChange,
  onChange
}) => {
  const intl = useIntl();

  const formErrors = getFormErrors(["name", "description", "rating"], errors);

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage(commonMessages.generalInformations)}
      />
      <CardContent>
        <TextField
          error={!!formErrors.name}
          helperText={getProductErrorMessage(formErrors.name, intl)}
          disabled={disabled}
          fullWidth
          label={intl.formatMessage({
            id: "6AMFki",
            defaultMessage: "Name",
            description: "product name"
          })}
          name="name"
          value={data.name}
          onChange={onChange}
        />
        <FormSpacer />
        <RichTextEditor
          data={data.description}
          disabled={disabled}
          error={!!formErrors.description}
          helperText={getProductErrorMessage(formErrors.description, intl)}
          label={intl.formatMessage(commonMessages.description)}
          name="description"
          onChange={onDescriptionChange}
        />
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
              description: "product rating"
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
