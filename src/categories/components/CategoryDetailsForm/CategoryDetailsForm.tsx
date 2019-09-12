import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import { RawDraftContentState } from "draft-js";
import React from "react";
import { useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import FormSpacer from "@saleor/components/FormSpacer";
import RichTextEditor from "@saleor/components/RichTextEditor";
import { commonMessages } from "@saleor/intl";
import { maybe } from "../../../misc";
import { CategoryDetails_category } from "../../types/CategoryDetails";

interface CategoryDetailsFormProps {
  category?: CategoryDetails_category;
  data: {
    name: string;
    description: RawDraftContentState;
  };
  disabled: boolean;
  errors: { [key: string]: string };
  onChange: (event: React.ChangeEvent<any>) => void;
}

export const CategoryDetailsForm: React.FC<CategoryDetailsFormProps> = ({
  category,
  disabled,
  data,
  onChange,
  errors
}) => {
  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage(commonMessages.generalInformations)}
      />
      <CardContent>
        <div>
          <TextField
            label={intl.formatMessage({
              defaultMessage: "Category Name"
            })}
            name="name"
            disabled={disabled}
            value={data && data.name}
            onChange={onChange}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
          />
        </div>
        <FormSpacer />
        <RichTextEditor
          disabled={disabled}
          error={!!errors.descriptionJson}
          helperText={errors.descriptionJson}
          label={intl.formatMessage({
            defaultMessage: "Category Description"
          })}
          initial={maybe(() => JSON.parse(category.descriptionJson))}
          name="description"
          onChange={onChange}
        />
      </CardContent>
    </Card>
  );
};
export default CategoryDetailsForm;
