import { OutputData } from "@editorjs/editorjs";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import CardTitle from "@saleor/components/CardTitle";
import FormSpacer from "@saleor/components/FormSpacer";
import Grid from "@saleor/components/Grid";
import Hr from "@saleor/components/Hr";
import RichTextEditor, {
  RichTextEditorChange
} from "@saleor/components/RichTextEditor";
import { ProductErrorFragment } from "@saleor/fragments/types/ProductErrorFragment";
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

  const formErrors = getFormErrors(
    ["name", "descriptionJson", "rating"],
    errors
  );

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
          error={!!formErrors.descriptionJson}
          helperText={getProductErrorMessage(formErrors.descriptionJson, intl)}
          label={intl.formatMessage(commonMessages.description)}
          name="description"
          onChange={onDescriptionChange}
        />
        <Hr />
        <FormSpacer />
        <Grid variant="uniform">
          <TextField
            type="number"
            error={!!formErrors.rating}
            helperText={getProductErrorMessage(formErrors.rating, intl)}
            disabled={disabled}
            label={intl.formatMessage({
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
