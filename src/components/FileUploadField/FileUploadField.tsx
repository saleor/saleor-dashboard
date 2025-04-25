// @ts-strict-ignore
import { FileFragment } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { Box, Button, Skeleton, Text, TrashBinIcon } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

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
  disabled: boolean;
  loading: boolean;
  file: FileChoiceType;
  error?: boolean;
  helperText?: string;
  onFileUpload: (file: File) => void;
  onFileDelete: () => void;
}

const FileUploadField: React.FC<FileUploadFieldProps> = props => {
  const { loading, disabled, file, error, helperText, onFileUpload, onFileDelete, inputProps } =
    props;
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
      <Box display="flex" justifyContent="flex-start" alignItems="center">
        {file.label ? (
          <Box display="flex" gap={2} alignItems="center">
            <Text size={2}>
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
          <Text size={2} color="critical1" paddingLeft={3}>
            {helperText}
          </Text>
        )}
      </Box>
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
