import { OutputData } from "@editorjs/editorjs";
import { Card, CardContent, TextField } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import FormSpacer from "@saleor/components/FormSpacer";
import RichTextEditor from "@saleor/components/RichTextEditor";
import { RichTextEditorLoading } from "@saleor/components/RichTextEditor/RichTextEditorLoading";
import { CollectionErrorFragment } from "@saleor/graphql";
import { commonMessages } from "@saleor/intl";
import { getFormErrors, getProductErrorMessage } from "@saleor/utils/errors";
import { useRichTextContext } from "@saleor/utils/richText/context";
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
  const {
    defaultValue,
    editorRef,
    isReadyForMount,
    handleChange,
  } = useRichTextContext();
  const formErrors = getFormErrors(["name", "description"], errors);

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage(commonMessages.generalInformations)}
      />
      <CardContent>
        <TextField
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
