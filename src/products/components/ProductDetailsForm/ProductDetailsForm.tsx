import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { RawDraftContentState } from "draft-js";
import React from "react";
import { useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import FormSpacer from "@saleor/components/FormSpacer";
import RichTextEditor from "@saleor/components/RichTextEditor";
import { commonMessages } from "@saleor/intl";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: "grid",
      gridColumnGap: theme.spacing.unit * 2 + "px",
      gridTemplateColumns: `3fr 1fr`
    }
  });

interface ProductDetailsFormProps extends WithStyles<typeof styles> {
  data: {
    description: RawDraftContentState;
    name: string;
  };
  disabled?: boolean;
  errors: { [key: string]: string };
  // Draftail isn't controlled - it needs only initial input
  // because it's autosaving on its own.
  // Ref https://github.com/mirumee/saleor/issues/4470
  initialDescription: RawDraftContentState;
  onChange(event: any);
}

export const ProductDetailsForm = withStyles(styles, {
  name: "ProductDetailsForm"
})(
  ({
    classes,
    data,
    disabled,
    errors,
    initialDescription,
    onChange
  }: ProductDetailsFormProps) => {
    const intl = useIntl();

    return (
      <Card>
        <CardTitle
          title={intl.formatMessage(commonMessages.generalInformations)}
        />
        <CardContent>
          <div className={classes.root}>
            <TextField
              error={!!errors.name}
              helperText={errors.name}
              disabled={disabled}
              fullWidth
              label={intl.formatMessage({
                defaultMessage: "Name",
                description: "product name"
              })}
              name="name"
              rows={5}
              value={data.name}
              onChange={onChange}
            />
          </div>
          <FormSpacer />
          <RichTextEditor
            disabled={disabled}
            error={!!errors.descriptionJson}
            helperText={errors.descriptionJson}
            initial={initialDescription}
            label={intl.formatMessage(commonMessages.description)}
            name="description"
            onChange={onChange}
          />
        </CardContent>
      </Card>
    );
  }
);
ProductDetailsForm.displayName = "ProductDetailsForm";
export default ProductDetailsForm;
