import { OutputData } from "@editorjs/editorjs";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import CardTitle from "@saleor/components/CardTitle";
import FormSpacer from "@saleor/components/FormSpacer";
import RichTextEditor, {
  RichTextEditorChange
} from "@saleor/components/RichTextEditor";
import { CollectionErrorFragment } from "@saleor/fragments/types/CollectionErrorFragment";
import { commonMessages } from "@saleor/intl";
import { getFormErrors, getProductErrorMessage } from "@saleor/utils/errors";
import React from "react";
import { useIntl } from "react-intl";

export interface CollectionDetailsProps {
  data: {
    description: OutputData;
    name: string;
  };
  disabled: boolean;
  errors: CollectionErrorFragment[];
  onChange: (event: React.ChangeEvent<any>) => void;
  onDescriptionChange: RichTextEditorChange;
}

const CollectionDetails: React.FC<CollectionDetailsProps> = ({
  disabled,
  data,
  onChange,
  onDescriptionChange,
  errors
}) => {
  const intl = useIntl();

  const formErrors = getFormErrors(["name", "descriptionJson"], errors);

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage(commonMessages.generalInformations)}
      />
      <CardContent>
        <TextField
          label={intl.formatMessage({
            defaultMessage: "Name",
            description: "collection name"
          })}
          name="name"
          disabled={disabled}
          value={data.name}
          onChange={onChange}
          error={!!formErrors.name}
          helperText={getProductErrorMessage(formErrors.name, intl)}
          fullWidth
        />
        <FormSpacer />
        <RichTextEditor
          data={data.description}
          error={!!formErrors.descriptionJson}
          helperText={getProductErrorMessage(formErrors.descriptionJson, intl)}
          label={intl.formatMessage(commonMessages.description)}
          name="description"
          disabled={disabled}
          onChange={onDescriptionChange}
        />
      </CardContent>
    </Card>
  );
};
export default CollectionDetails;
