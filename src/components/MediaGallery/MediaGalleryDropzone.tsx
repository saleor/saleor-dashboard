import Dropzone from "@dashboard/components/Dropzone";
import { iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { Image } from "lucide-react";
import type * as React from "react";
import type { DropzoneState } from "react-dropzone";
import { FormattedMessage, type MessageDescriptor } from "react-intl";

import styles from "./MediaGallery.module.css";
import { messages } from "./messages";

interface MediaGalleryDropzoneProps {
  onImageUpload: (files: FileList | File[]) => void;
  disableClick?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  uploadHintMessage?: MessageDescriptor;
  uploadHintDropMessage?: MessageDescriptor;
  variant: "empty" | "gallery";
  galleryClassName?: string;
  children?: (props: { isDragActive: boolean }) => React.ReactNode;
}

export const MediaGalleryDropzone = ({
  onImageUpload,
  disableClick = false,
  disabled = false,
  multiple = true,
  uploadHintMessage = messages.uploadHint,
  uploadHintDropMessage = messages.uploadHintDrop,
  variant,
  galleryClassName,
  children,
}: MediaGalleryDropzoneProps) => (
  <Dropzone
    multiple={multiple}
    noClick={disableClick || disabled}
    disabled={disabled}
    onDrop={onImageUpload}
  >
    {({ isDragActive, getInputProps, getRootProps }: DropzoneState) => {
      if (variant === "empty") {
        return (
          <div
            {...getRootProps()}
            className={clsx(
              styles.dropzone,
              isDragActive && styles.dropzoneActive,
              disabled && styles.dropzoneDisabled,
            )}
            data-test-id="product-media-dropzone"
          >
            <input
              {...getInputProps({ multiple, accept: "image/*" })}
              className={styles.hiddenInput}
            />
            <div className={styles.dropzoneContent}>
              <Image
                className={styles.dropzoneIcon}
                size={28}
                strokeWidth={iconStrokeWidthBySize.large}
                aria-hidden
              />
              <Text size={2} color="default2">
                <FormattedMessage {...uploadHintMessage} />
              </Text>
            </div>
          </div>
        );
      }

      return (
        <div
          {...getRootProps()}
          className={clsx(styles.galleryContainer, galleryClassName)}
          data-test-id="product-media-gallery"
        >
          <input
            {...getInputProps({ multiple, accept: "image/*" })}
            className={styles.hiddenInput}
          />
          {children?.({ isDragActive: disabled ? false : isDragActive })}
          {isDragActive && !disabled && (
            <div className={styles.dropOverlayWrapper}>
              <div className={styles.dropOverlay}>
                <Text size={2} color="default2">
                  <FormattedMessage {...uploadHintDropMessage} />
                </Text>
              </div>
            </div>
          )}
        </div>
      );
    }}
  </Dropzone>
);
