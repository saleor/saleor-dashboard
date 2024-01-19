// @ts-strict-ignore
import CardTitle from "@dashboard/components/CardTitle";
import FormSpacer from "@dashboard/components/FormSpacer";
import RichTextEditor from "@dashboard/components/RichTextEditor";
import { RichTextEditorLoading } from "@dashboard/components/RichTextEditor/RichTextEditorLoading";
import { CollectionErrorFragment } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { getFormErrors, getProductErrorMessage } from "@dashboard/utils/errors";
import { useRichTextContext } from "@dashboard/utils/richText/context";
import { OutputData } from "@editorjs/editorjs";
import { Card, CardContent, TextField } from "@material-ui/core";
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
}

const CollectionDetails: React.FC<CollectionDetailsProps> = ({
  disabled,
  data,
  onChange,
  errors,
}) => {
  const intl = useIntl();
  const { defaultValue, editorRef, isReadyForMount, handleChange } =
    useRichTextContext();
  const formErrors = getFormErrors(["name", "description"], errors);

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage(commonMessages.generalInformations)}
      />
      <CardContent>
        <TextField
          data-test-id="collection-name-input"
          label={intl.formatMessage({
            id: "/WXs6H",
            defaultMessage: "Name",
            description: "collection name",
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
        {isReadyForMount ? (
          <RichTextEditor
            defaultValue={defaultValue}
            editorRef={editorRef}
            onChange={handleChange}
            error={!!formErrors.description}
            helperText={getProductErrorMessage(formErrors.description, intl)}
            label={intl.formatMessage(commonMessages.description)}
            name="description"
            disabled={disabled}
          />
        ) : (
          <RichTextEditorLoading
            label={intl.formatMessage(commonMessages.description)}
            name="description"
          />
        )}
      </CardContent>
    </Card>
  );
};
export default CollectionDetails;
