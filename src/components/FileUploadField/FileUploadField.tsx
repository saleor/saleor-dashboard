import { FileFragment } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { Box, Button, Text, TrashBinIcon } from "@saleor/macaw-ui/next";
import React from "react";
import { useIntl } from "react-intl";

import Skeleton from "../Skeleton";

export interface FileChoiceType {
  label: string;
  value: string;
  file?: FileFragment;
}

export interface FileUploadFieldProps {
  inputProps?: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >;
  className?: string;
  disabled: boolean;
  loading: boolean;
  file: FileChoiceType;
  error?: boolean;
  helperText?: string;
  onFileUpload: (file: File) => void;
  onFileDelete: () => void;
}

const FileUploadField: React.FC<FileUploadFieldProps> = props => {
  const {
    loading,
    disabled,
    file,
    className,
    error,
    helperText,
    onFileUpload,
    onFileDelete,
    inputProps,
  } = props;
  const intl = useIntl();

  const fileInputAnchor = React.createRef<HTMLInputElement>();
  const clickFileInput = () => fileInputAnchor.current.click();

  const handleFileDelete = () => {
    fileInputAnchor.current.value = "";
    onFileDelete();
  };

  React.useEffect(() => {
    if (!file.value) {
      fileInputAnchor.current.value = "";
    }
  }, [file]);

  return (
    <>
      <div className={className}>
        {file.label ? (
          <Box display="flex" gap={5} alignItems="center">
            <Text variant="caption">
              {loading ? (
                <Skeleton />
              ) : (
                <a href={file.file?.url} target="blank">
                  {file.label}
                </a>
              )}
            </Text>
            <Button
              icon={<TrashBinIcon />}
              variant="secondary"
              onClick={handleFileDelete}
              disabled={disabled || loading}
              data-test-id="button-delete-file"
              type="button"
            />
          </Box>
        ) : (
          <Button
            onClick={clickFileInput}
            disabled={disabled || loading}
            variant="secondary"
            data-test-id="button-upload-file"
            type="button"
          >
            {intl.formatMessage(commonMessages.chooseFile)}
          </Button>
        )}
        {error && (
          <Text variant="caption" color="textCriticalDefault">
            {helperText}
          </Text>
        )}
      </div>
      <input
        style={{ display: "none" }}
        id="fileUpload"
        onChange={event => onFileUpload(event.target.files[0])}
        type="file"
        data-test-id="upload-file-input"
        ref={fileInputAnchor}
        {...inputProps}
      />
    </>
  );
};
FileUploadField.displayName = "FileUploadField";
export default FileUploadField;
