import Button from "@material-ui/core/Button";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import React from "react";
import { FormattedMessage } from "react-intl";

const styles = createStyles({
  fileUploadField: {
    display: "none"
  },
  root: {
    display: "flex"
  },
  textField: {
    flex: 1
  }
});

interface FileUploadProps extends WithStyles<typeof styles> {
  disabled?: boolean;
  name?: string;
  value?: any;
  onChange?(event: React.ChangeEvent<any>);
}

const FileUpload = withStyles(styles, { name: "FileUpload" })(
  ({ classes, disabled, name, value, onChange }: FileUploadProps) => (
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
  )
);
FileUpload.displayName = "FileUpload";
export default FileUpload;
