import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles(
  {
    fileUploadField: {
      display: "none"
    },
    root: {
      display: "flex"
    },
    textField: {
      flex: 1
    }
  },
  { name: "FileUpload" }
);

interface FileUploadProps {
  disabled?: boolean;
  name?: string;
  value?: any;
  onChange?(event: React.ChangeEvent<any>);
}

const FileUpload: React.FC<FileUploadProps> = props => {
  const { disabled, name, value, onChange } = props;

  const classes = useStyles(props);

  return (
    <div className={classes.root}>
      <input
        disabled={disabled}
        name={name}
        onChange={onChange}
        ref={ref => (this.upload = ref)}
        className={classes.fileUploadField}
        type="file"
        value={value}
      />
      <TextField
        className={classes.textField}
        disabled={disabled}
        onChange={undefined}
        value={value}
      />
      <Button disabled={disabled} onClick={() => this.upload.click()}>
        <FormattedMessage
          defaultMessage="Upload"
          description="upload file, button"
        />
      </Button>
    </div>
  );
};
FileUpload.displayName = "FileUpload";
export default FileUpload;
