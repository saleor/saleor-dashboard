import { makeStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import { commonMessages } from "@saleor/intl";
import React from "react";
import { useIntl } from "react-intl";

export interface FileUploadFieldProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  disabled: boolean;
  fileName?: string;
  onFileUpload: (file: File) => void;
  onFileDelete: () => void;
}

const useStyles = makeStyles(
  theme => ({
    fileField: {
      display: "none"
    },
    uploadFileContent: {
      color: theme.palette.primary.main,
      fontSize: "1rem"
    }
  }),
  { name: "FileUploadField" }
);

const FileUploadField: React.FC<FileUploadFieldProps> = props => {
  const { disabled, fileName, onFileUpload, onFileDelete, ...rest } = props;
  const classes = useStyles({});
  const intl = useIntl();

  const fileInputAnchor = React.createRef<HTMLInputElement>();
  const clickFileInput = () => fileInputAnchor.current.click();

  return (
    <>
      {fileName ? (
        <div className={classes.uploadFileContent}>
          {fileName}
          <IconButton
            color="primary"
            onClick={onFileDelete}
            disabled={disabled}
            data-test="button-delete-file"
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ) : (
        <>
          <Button
            onClick={clickFileInput}
            disabled={disabled}
            variant="outlined"
            color="primary"
            data-test="button-upload-file"
          >
            {intl.formatMessage(commonMessages.chooseFile)}
          </Button>
        </>
      )}
      <input
        className={classes.fileField}
        id="fileUpload"
        onChange={event => onFileUpload(event.target.files[0])}
        type="file"
        ref={fileInputAnchor}
        {...rest}
      />
    </>
  );
};
FileUploadField.displayName = "FileUploadField";
export default FileUploadField;
