import { DashboardCard } from "@dashboard/components/Card";
import FormSpacer from "@dashboard/components/FormSpacer";
import RichTextEditor from "@dashboard/components/RichTextEditor";
import { RichTextEditorLoading } from "@dashboard/components/RichTextEditor/RichTextEditorLoading";
import { ProductErrorFragment } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { getFormErrors, getProductErrorMessage } from "@dashboard/utils/errors";
import { useRichTextContext } from "@dashboard/utils/richText/context";
import { OutputData } from "@editorjs/editorjs";
import { TextField } from "@material-ui/core";
import * as React from "react";
import { useIntl } from "react-intl";

interface CategoryDetailsFormProps {
  data: {
    name: string;
    description: OutputData | null;
  };
  disabled: boolean;
  errors: ProductErrorFragment[];
  onChange: (event: React.ChangeEvent<any>) => void;
}

export const CategoryDetailsForm = ({
  disabled,
  data,
  onChange,
  errors,
}: CategoryDetailsFormProps) => {
  const intl = useIntl();
  const { defaultValue, editorRef, isReadyForMount, handleChange } = useRichTextContext();
  const formErrors = getFormErrors(["name", "description"], errors);

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage(commonMessages.generalInformations)}
        </DashboardCard.Title>
      </DashboardCard.Header>

      <DashboardCard.Content>
        <div>
          <TextField
            data-test-id="category-name-input"
            label={intl.formatMessage({
              id: "vEYtiq",
              defaultMessage: "Category Name",
            })}
            name="name"
            disabled={disabled}
            value={data && data.name}
            onChange={onChange}
            error={!!formErrors.name}
            helperText={getProductErrorMessage(formErrors.name, intl)}
            fullWidth
          />
        </div>
        <FormSpacer />
        {isReadyForMount ? (
          <RichTextEditor
            data-test-id="category-description-editor"
            defaultValue={defaultValue}
            editorRef={editorRef}
            onChange={handleChange}
            disabled={disabled}
            error={!!formErrors.description}
            helperText={getProductErrorMessage(formErrors.description, intl)}
            label={intl.formatMessage({
              id: "8HRy+U",
              defaultMessage: "Category Description",
            })}
            name="description"
          />
        ) : (
          <RichTextEditorLoading
            label={intl.formatMessage({
              id: "8HRy+U",
              defaultMessage: "Category Description",
            })}
            name="description"
          />
        )}
      </DashboardCard.Content>
    </DashboardCard>
  );
};
export default CategoryDetailsForm;
