import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
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

const styles = createStyles({
  root: {
    width: "50%"
  }
});

interface CategoryDetailsFormProps extends WithStyles<typeof styles> {
  category?: CategoryDetails_category;
  data: {
    name: string;
    description: RawDraftContentState;
  };
  disabled: boolean;
  errors: { [key: string]: string };
  onChange: (event: React.ChangeEvent<any>) => void;
}

export const CategoryDetailsForm = withStyles(styles, {
  name: "CategoryDetailsForm"
})(
  ({
    category,
    classes,
    disabled,
    data,
    onChange,
    errors
  }: CategoryDetailsFormProps) => {
    const intl = useIntl();

    return (
      <Card>
        <CardTitle
          title={intl.formatMessage(commonMessages.generalInformations)}
        />
        <CardContent>
          <>
            <div>
              <TextField
                classes={{ root: classes.root }}
                label={intl.formatMessage({
                  defaultMessage: "Name",
                  description: "category name",
                  id: "categoryDetailsFormNameInputLabel"
                })}
                name="name"
                disabled={disabled}
                value={data && data.name}
                onChange={onChange}
                error={!!errors.name}
                helperText={errors.name}
              />
            </div>
            <FormSpacer />
            <RichTextEditor
              disabled={disabled}
              error={!!errors.descriptionJson}
              helperText={errors.descriptionJson}
              label={intl.formatMessage(commonMessages.description)}
              initial={maybe(() => JSON.parse(category.descriptionJson))}
              name="description"
              onChange={onChange}
            />
          </>
        </CardContent>
      </Card>
    );
  }
);
CategoryDetailsForm.displayName = "CategoryDetailsForm";
export default CategoryDetailsForm;
