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
import { maybe } from "@saleor/misc";
import { FormErrors } from "@saleor/types";
import { CollectionDetails_collection } from "../../types/CollectionDetails";

const styles = createStyles({
  name: {
    width: "80%"
  }
});

export interface CollectionDetailsProps extends WithStyles<typeof styles> {
  collection?: CollectionDetails_collection;
  data: {
    description: RawDraftContentState;
    name: string;
  };
  disabled: boolean;
  errors: FormErrors<"descriptionJson" | "name">;
  onChange: (event: React.ChangeEvent<any>) => void;
}

const CollectionDetails = withStyles(styles, { name: "CollectionDetails" })(
  ({
    classes,
    collection,
    disabled,
    data,
    onChange,
    errors
  }: CollectionDetailsProps) => {
    const intl = useIntl();

    return (
      <Card>
        <CardTitle
          title={intl.formatMessage(commonMessages.generalInformations)}
        />
        <CardContent>
          <TextField
            classes={{ root: classes.name }}
            label={intl.formatMessage({
              defaultMessage: "Name",
              description: "collection name"
            })}
            name="name"
            disabled={disabled}
            value={data.name}
            onChange={onChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          <FormSpacer />
          <RichTextEditor
            error={!!errors.descriptionJson}
            helperText={errors.descriptionJson}
            initial={maybe(() => JSON.parse(collection.descriptionJson))}
            label={intl.formatMessage(commonMessages.description)}
            name="description"
            disabled={disabled}
            onChange={onChange}
          />
        </CardContent>
      </Card>
    );
  }
);
CollectionDetails.displayName = "CollectionDetails";
export default CollectionDetails;
