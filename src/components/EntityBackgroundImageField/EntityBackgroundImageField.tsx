import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { MediaWithFallback } from "@dashboard/components/MediaWithFallback/MediaWithFallback";
import { Skeleton } from "@dashboard/components/Skeleton/Skeleton";
import { SaleorThrobber } from "@dashboard/components/Throbber/SaleorThrobber";
import { buttonMessages } from "@dashboard/intl";
import { messages as productMediaMessages } from "@dashboard/products/components/ProductMedia/messages";
import { ProductMediaGalleryDropzone } from "@dashboard/products/components/ProductMedia/ProductMediaGalleryDropzone";
import { Box, Button, Input, Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { Trash2 } from "lucide-react";
import type * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import styles from "./EntityBackgroundImageField.module.css";
import { entityBackgroundImageFieldMessages } from "./messages";
import {
  type EntityBackgroundImage,
  type EntityBackgroundImageFieldMessages,
  type EntityBackgroundImageFieldTestIds,
} from "./types";
import { withImageRevision } from "./withImageRevision";

const handleSingleImageUpload =
  (onImageUpload: (file: File) => void) => (files: FileList | File[]) => {
    const file = files[0];

    if (file) {
      onImageUpload(file);
    }
  };

const stopDropzoneActivation = (event: React.SyntheticEvent) => {
  event.stopPropagation();
};

interface EntityBackgroundImageFieldProps {
  altFieldName?: string;
  backgroundImageAlt: string;
  backgroundImageRevision?: number;
  disabled?: boolean;
  image: EntityBackgroundImage | null | undefined;
  isUploading?: boolean;
  messages?: EntityBackgroundImageFieldMessages;
  testIds?: EntityBackgroundImageFieldTestIds;
  uploadPreviewUrl?: string | null;
  onAltChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImageDelete: () => void;
  onImageUpload: (file: File) => void;
  onUploadPreviewLoaded?: () => void;
}

interface BackgroundImagePreviewProps {
  backgroundImageRevision: number;
  disabled: boolean;
  hasSavedImage: boolean;
  isDragActive: boolean;
  isUploading: boolean;
  placeholderSrc: string | null;
  previewSrc: string;
  testIds?: EntityBackgroundImageFieldTestIds;
  onImageDelete: () => void;
  onUploadPreviewLoaded?: () => void;
}

const BackgroundImagePreview = ({
  backgroundImageRevision,
  disabled,
  hasSavedImage,
  isDragActive,
  isUploading,
  placeholderSrc,
  previewSrc,
  testIds,
  onImageDelete,
  onUploadPreviewLoaded,
}: BackgroundImagePreviewProps): JSX.Element => {
  const intl = useIntl();
  const showDelete = hasSavedImage && !disabled && !isUploading;

  return (
    <div
      className={clsx(
        styles.preview,
        isDragActive && styles.previewDragActive,
        isUploading && styles.previewUploading,
      )}
      data-test-id={testIds?.preview ?? "entity-background-image-preview"}
    >
      <MediaWithFallback
        key={`${previewSrc}-${backgroundImageRevision}`}
        className={styles.previewImage}
        src={previewSrc}
        alt=""
        placeholderSrc={placeholderSrc}
        onPlaceholderUnused={onUploadPreviewLoaded}
      />
      {isUploading ? (
        <div
          className={styles.previewUploadingOverlay}
          data-test-id="entity-background-image-uploading"
        >
          <SaleorThrobber size={32} />
        </div>
      ) : null}
      {showDelete ? (
        <>
          <div className={styles.previewOverlay} aria-hidden />
          <Box className={styles.previewActions}>
            <Box className={styles.deleteButtonBackdrop}>
              <Button
                data-test-id={testIds?.delete ?? "delete-entity-background-image"}
                variant="tertiary"
                size="small"
                type="button"
                className={styles.deleteButton}
                onClick={event => {
                  stopDropzoneActivation(event);
                  onImageDelete();
                }}
                onMouseDown={stopDropzoneActivation}
                title={intl.formatMessage(buttonMessages.delete)}
                icon={<Trash2 size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />}
              />
            </Box>
          </Box>
        </>
      ) : null}
    </div>
  );
};

export const EntityBackgroundImageField = ({
  altFieldName = "backgroundImageAlt",
  backgroundImageAlt,
  backgroundImageRevision = 0,
  disabled = false,
  image,
  isUploading = false,
  messages = entityBackgroundImageFieldMessages,
  testIds,
  uploadPreviewUrl = null,
  onAltChange,
  onImageDelete,
  onImageUpload,
  onUploadPreviewLoaded,
}: EntityBackgroundImageFieldProps): JSX.Element => {
  const intl = useIntl();
  const hasSavedImage = image != null;
  const hasPendingUpload = Boolean(uploadPreviewUrl);
  const showGallery = hasSavedImage || hasPendingUpload;
  const showEmptyDropzone = image === null && !hasPendingUpload;
  const isDropzoneDisabled = disabled || isUploading;
  const previewSrc = hasSavedImage
    ? withImageRevision(image.url, backgroundImageRevision)
    : (uploadPreviewUrl ?? "");
  const placeholderSrc = hasSavedImage && hasPendingUpload ? uploadPreviewUrl : null;

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={4}
      data-test-id={testIds?.root ?? "entity-background-image-field"}
    >
      <Box display="flex" flexDirection="column" gap={2}>
        {image === undefined && !hasPendingUpload ? (
          <Skeleton __height="120px" __width="100%" borderRadius={2} />
        ) : showEmptyDropzone ? (
          <ProductMediaGalleryDropzone
            variant="empty"
            multiple={false}
            disabled={isDropzoneDisabled}
            uploadHintMessage={productMediaMessages.uploadHint}
            uploadHintDropMessage={productMediaMessages.uploadHintDrop}
            onImageUpload={handleSingleImageUpload(onImageUpload)}
          />
        ) : showGallery ? (
          <ProductMediaGalleryDropzone
            variant="gallery"
            multiple={false}
            disabled={isDropzoneDisabled}
            galleryClassName={styles.gallery}
            uploadHintMessage={productMediaMessages.uploadHint}
            uploadHintDropMessage={productMediaMessages.uploadHintDrop}
            onImageUpload={handleSingleImageUpload(onImageUpload)}
          >
            {({ isDragActive }) => (
              <BackgroundImagePreview
                backgroundImageRevision={backgroundImageRevision}
                disabled={disabled}
                hasSavedImage={hasSavedImage}
                isDragActive={isDragActive}
                isUploading={isUploading}
                placeholderSrc={placeholderSrc}
                previewSrc={previewSrc}
                testIds={testIds}
                onImageDelete={onImageDelete}
                onUploadPreviewLoaded={onUploadPreviewLoaded}
              />
            )}
          </ProductMediaGalleryDropzone>
        ) : null}

        {image !== undefined || hasPendingUpload ? (
          <Text size={2} color="default2">
            <FormattedMessage {...messages.hint} />
          </Text>
        ) : null}
      </Box>

      {hasSavedImage ? (
        <Input
          name={altFieldName}
          label={intl.formatMessage(messages.imageAlt)}
          helperText={intl.formatMessage(messages.imageAltHelper)}
          disabled={disabled || isUploading}
          value={backgroundImageAlt}
          onChange={onAltChange}
        />
      ) : null}
    </Box>
  );
};

EntityBackgroundImageField.displayName = "EntityBackgroundImageField";
