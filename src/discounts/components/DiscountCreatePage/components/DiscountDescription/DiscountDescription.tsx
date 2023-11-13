import { DashboardCard } from "@dashboard/components/Card";
import RichTextEditor from "@dashboard/components/RichTextEditor";
import { RichTextEditorLoading } from "@dashboard/components/RichTextEditor/RichTextEditorLoading";
import { useRichTextContext } from "@dashboard/utils/richText/context";
import React from "react";
import { FormattedMessage } from "react-intl";

export const DiscountDescription = () => {
  const { defaultValue, editorRef, isReadyForMount, handleChange } =
    useRichTextContext();

  return (
    <DashboardCard>
      <DashboardCard.Title>
        <FormattedMessage defaultMessage="Description" id="Q8Qw5B" />
      </DashboardCard.Title>
      <DashboardCard.Content>
        {isReadyForMount ? (
          <RichTextEditor
            defaultValue={defaultValue}
            editorRef={editorRef}
            onChange={handleChange}
            disabled={false}
            error={false}
            helperText=""
            label="Optional"
            name="description"
          />
        ) : (
          <RichTextEditorLoading label="" name="description" />
        )}
      </DashboardCard.Content>
    </DashboardCard>
  );
};
