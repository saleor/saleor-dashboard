import Dropzone from "@dashboard/components/Dropzone";
import { Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import type * as React from "react";
import type { DropzoneState } from "react-dropzone";
import { FormattedMessage } from "react-intl";

import { messages } from "./messages";
import styles from "./ProductMedia.module.css";

interface ProductMediaGalleryDropzoneProps {
  onImageUpload: (files: FileList) => void;
  disableClick?: boolean;
  variant: "empty" | "gallery";
  children?: (props: { isDragActive: boolean }) => React.ReactNode;
}

export const ProductMediaGalleryDropzone = ({
  onImageUpload,
  disableClick = false,
  variant,
  children,
}: ProductMediaGalleryDropzoneProps) => (
  <Dropzone noClick={disableClick} onDrop={onImageUpload}>
    {({ isDragActive, getInputProps, getRootProps }: DropzoneState) => {
      if (variant === "empty") {
        return (
          <div
            {...getRootProps()}
            className={clsx(styles.dropzone, isDragActive && styles.dropzoneActive)}
            data-test-id="product-media-dropzone"
          >
            <input {...getInputProps()} className={styles.hiddenInput} accept="image/*" multiple />
            <div className={styles.dropzoneContent}>
              <Text size={2} color="default2">
                <FormattedMessage {...messages.uploadHint} />
              </Text>
            </div>
          </div>
        );
      }

      return (
        <div
          {...getRootProps()}
          className={styles.galleryContainer}
          data-test-id="product-media-gallery"
        >
          <input {...getInputProps()} className={styles.hiddenInput} accept="image/*" multiple />
          {children?.({ isDragActive })}
          {isDragActive && (
            <div className={styles.dropOverlayWrapper}>
              <div className={styles.dropOverlay}>
                <Text size={2} color="default2">
                  <FormattedMessage {...messages.uploadHint} />
                </Text>
              </div>
            </div>
          )}
        </div>
      );
    }}
  </Dropzone>
);
