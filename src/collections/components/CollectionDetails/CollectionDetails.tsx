import { DetailSettingsCard } from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";
import { EntityBackgroundImageField } from "@dashboard/components/EntityBackgroundImageField/EntityBackgroundImageField";
import FormSpacer from "@dashboard/components/FormSpacer";
import RichTextEditor from "@dashboard/components/RichTextEditor";
import { RichTextEditorLoading } from "@dashboard/components/RichTextEditor/RichTextEditorLoading";
import { type CollectionDetailsFragment, type CollectionErrorFragment } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { getFormErrors, getProductErrorMessage } from "@dashboard/utils/errors";
import { useRichTextContext } from "@dashboard/utils/richText/context";
import { type OutputData } from "@editorjs/editorjs";
import { Input } from "@saleor/macaw-ui-next";
import type * as React from "react";
import { useEffect, useRef } from "react";
import { useIntl } from "react-intl";

import { collectionBackgroundImageMessages } from "./collectionBackgroundImageMessages";

interface CollectionDetailsProps {
  data: {
    backgroundImageAlt: string;
    description: OutputData;
    name: string;
  };
  disabled: boolean;
  errors: CollectionErrorFragment[];
  image?: CollectionDetailsFragment["backgroundImage"];
  backgroundImageRevision?: number;
  backgroundImageUploadPreview?: string | null;
  isBackgroundImageUploading?: boolean;
  onUploadPreviewLoaded?: () => void;
  onChange: (event: React.ChangeEvent<any>) => void;
  onImageDelete?: () => void;
  onImageUpload?: (file: File) => void;
}

export const CollectionDetails = ({
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
}: CollectionDetailsProps) => {
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
      data-test-id="collection-general-settings"
    >
      <Input
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
      {onImageUpload && onImageDelete ? (
        <>
          <FormSpacer />
          <EntityBackgroundImageField
            backgroundImageAlt={data.backgroundImageAlt}
            backgroundImageRevision={backgroundImageRevision}
            disabled={disabled}
            image={image}
            isUploading={isBackgroundImageUploading}
            messages={collectionBackgroundImageMessages}
            testIds={{
              delete: "delete-collection-background-image",
              preview: "collection-background-image-preview",
              root: "collection-media-settings",
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
