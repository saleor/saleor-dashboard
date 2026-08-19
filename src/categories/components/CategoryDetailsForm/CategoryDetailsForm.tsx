import { DetailSettingsCard } from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";
import { EntityBackgroundImageField } from "@dashboard/components/EntityBackgroundImageField/EntityBackgroundImageField";
import FormSpacer from "@dashboard/components/FormSpacer";
import RichTextEditor from "@dashboard/components/RichTextEditor";
import { RichTextEditorLoading } from "@dashboard/components/RichTextEditor/RichTextEditorLoading";
import { type CategoryDetailsFragment, type ProductErrorFragment } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { getFormErrors, getProductErrorMessage } from "@dashboard/utils/errors";
import { useRichTextContext } from "@dashboard/utils/richText/context";
import { type OutputData } from "@editorjs/editorjs";
import { Input } from "@saleor/macaw-ui-next";
import type * as React from "react";
import { useEffect, useRef } from "react";
import { useIntl } from "react-intl";

import { categoryBackgroundImageMessages } from "./categoryBackgroundImageMessages";

interface CategoryDetailsFormProps {
  data: {
    backgroundImageAlt?: string;
    name: string;
    description: OutputData | null;
  };
  disabled: boolean;
  errors: ProductErrorFragment[];
  image?: CategoryDetailsFragment["backgroundImage"];
  backgroundImageRevision?: number;
  backgroundImageUploadPreview?: string | null;
  isBackgroundImageUploading?: boolean;
  onUploadPreviewLoaded?: () => void;
  onChange: (event: React.ChangeEvent<any>) => void;
  onImageDelete?: () => void;
  onImageUpload?: (file: File) => void;
}

export const CategoryDetailsForm = ({
  disabled,
  data,
  image,
  backgroundImageRevision = 0,
  backgroundImageUploadPreview = null,
  isBackgroundImageUploading = false,
  onUploadPreviewLoaded,
  onChange,
  onImageDelete,
  onImageUpload,
  errors,
}: CategoryDetailsFormProps) => {
  const intl = useIntl();
  const { defaultValue, editorRef, isReadyForMount, handleChange } = useRichTextContext();
  const formErrors = getFormErrors(["name", "description"], errors);
  const previousImage = useRef(image);

  useEffect(() => {
    const imageWasDeleted = Boolean(previousImage.current) && !image;

    previousImage.current = image;

    if (imageWasDeleted && data.backgroundImageAlt) {
      onChange({
        target: {
          name: "backgroundImageAlt",
          value: "",
        },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  }, [image, onChange]);

  return (
    <DetailSettingsCard
      title={intl.formatMessage(commonMessages.generalInformations)}
      data-test-id="category-general-settings"
    >
      <Input
        data-test-id="category-name-input"
        label={intl.formatMessage({
          id: "vEYtiq",
          defaultMessage: "Category Name",
        })}
        name="name"
        disabled={disabled}
        value={data.name}
        onChange={onChange}
        error={!!formErrors.name}
        helperText={getProductErrorMessage(formErrors.name, intl)}
      />
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
      {onImageUpload && onImageDelete ? (
        <>
          <FormSpacer />
          <EntityBackgroundImageField
            backgroundImageAlt={data.backgroundImageAlt ?? ""}
            backgroundImageRevision={backgroundImageRevision}
            disabled={disabled}
            image={image}
            isUploading={isBackgroundImageUploading}
            messages={categoryBackgroundImageMessages}
            testIds={{
              delete: "delete-category-background-image",
              preview: "category-background-image-preview",
              root: "category-media-settings",
            }}
            uploadPreviewUrl={backgroundImageUploadPreview}
            onAltChange={onChange}
            onImageDelete={onImageDelete}
            onImageUpload={onImageUpload}
            onUploadPreviewLoaded={onUploadPreviewLoaded}
          />
        </>
      ) : null}
    </DetailSettingsCard>
  );
};
