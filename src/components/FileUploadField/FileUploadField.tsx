import Dropzone from "@dashboard/components/Dropzone";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { type FileFragment } from "@dashboard/graphql";
import { Box, Button, Skeleton, Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { Trash2 } from "lucide-react";
import { type InputHTMLAttributes, useEffect, useState } from "react";
import type { DropzoneState } from "react-dropzone";
import { defineMessages, FormattedMessage } from "react-intl";

import styles from "./FileUploadField.module.css";
import { isImageFileChoice } from "./isImageFileChoice";

export interface FileChoiceType {
  label: string;
  value: string;
  file?: FileFragment;
}

interface FileUploadFieldProps {
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  disabled: boolean;
  loading: boolean;
  file: FileChoiceType;
  error?: boolean;
  helperText?: string;
  onFileUpload: (file: File) => void;
  onFileDelete: () => void;
}

const messages = defineMessages({
  uploadHint: {
    id: "EMQgvH",
    defaultMessage: "Drag and drop or click to upload",
    description: "file attribute empty dropzone hint",
  },
  replaceHint: {
    id: "wFsAkW",
    defaultMessage: "Drop to replace",
    description: "file attribute dropzone hint when replacing an existing file",
  },
});

export { isImageFileChoice } from "./isImageFileChoice";

export const FileUploadField = ({
  loading,
  disabled,
  file,
  error,
  helperText,
  onFileUpload,
  onFileDelete,
  inputProps,
}: FileUploadFieldProps) => {
  const hasFile = Boolean(file.label);
  const isDisabled = disabled || loading;
  const fileUrl = file.file?.url;
  const [thumbnailFailed, setThumbnailFailed] = useState(false);
  const showThumbnail =
    !loading && !thumbnailFailed && isImageFileChoice(file.file) && Boolean(fileUrl);

  useEffect(() => {
    setThumbnailFailed(false);
  }, [fileUrl]);

  const handleDrop = (files: File[] | FileList) => {
    if (isDisabled) {
      return;
    }

    const [firstFile] = Array.from(files);

    if (!firstFile) {
      return;
    }

    onFileUpload(firstFile);
  };

  return (
    <Box display="flex" flexDirection="column" gap={1} __minWidth={0} width="100%">
      {/* Remount when cleared so the same file can be chosen again */}
      <Dropzone
        key={file.value || "empty"}
        noClick={hasFile || isDisabled}
        disabled={isDisabled}
        multiple={false}
        onDrop={handleDrop}
      >
        {({ isDragActive, getInputProps, getRootProps }: DropzoneState) => {
          const dropzoneInputProps = getInputProps();

          return (
            <div
              {...getRootProps()}
              className={styles.uploadRoot}
              data-test-id="file-upload-dropzone"
            >
              <input
                {...dropzoneInputProps}
                name={inputProps?.name}
                accept={inputProps?.accept}
                className={styles.hiddenInput}
                data-test-id="upload-file-input"
              />
              {hasFile ? (
                <div className={styles.filled}>
                  <div className={styles.fileMeta}>
                    {showThumbnail ? (
                      <img
                        src={fileUrl}
                        alt={file.label}
                        className={styles.thumbnail}
                        data-test-id="file-upload-thumbnail"
                        onError={() => setThumbnailFailed(true)}
                      />
                    ) : null}
                    <Text size={2} className={styles.fileName}>
                      {loading ? (
                        <Skeleton />
                      ) : fileUrl ? (
                        <a href={fileUrl} target="_blank" rel="noreferrer">
                          {file.label}
                        </a>
                      ) : (
                        file.label
                      )}
                    </Text>
                  </div>
                  <Button
                    icon={
                      <Trash2 size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
                    }
                    variant="secondary"
                    onClick={event => {
                      event.stopPropagation();
                      event.preventDefault();
                      onFileDelete();
                    }}
                    disabled={isDisabled}
                    data-test-id="button-delete-file"
                    type="button"
                  />
                  {isDragActive && !isDisabled ? (
                    <div className={styles.replaceHint} data-test-id="file-upload-replace-hint">
                      <Text size={2} color="default2">
                        <FormattedMessage {...messages.replaceHint} />
                      </Text>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div
                  className={clsx(
                    styles.dropzone,
                    isDragActive && styles.dropzoneActive,
                    isDisabled && styles.dropzoneDisabled,
                  )}
                  data-test-id="button-upload-file"
                >
                  <Text size={2} color="default2">
                    {loading ? <Skeleton /> : <FormattedMessage {...messages.uploadHint} />}
                  </Text>
                </div>
              )}
            </div>
          );
        }}
      </Dropzone>
      {error ? (
        <Text size={2} color="critical1">
          {helperText}
        </Text>
      ) : null}
    </Box>
  );
};

FileUploadField.displayName = "FileUploadField";
export default FileUploadField;
