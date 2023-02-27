import {
  Dialog,
  DialogContent,
  DialogProps,
  DialogTitle,
  IconButton,
  Typography,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";

import { useStyles } from "./styles";

interface AppDialogProps extends DialogProps {
  onClose: () => void;
}

export const AppDialog: React.FC<AppDialogProps> = ({ children, ...props }) => {
  const classes = useStyles();

  return (
    <Dialog aria-labelledby="extension app dialog" {...props}>
      <DialogTitle disableTypography className={classes.header}>
        <Typography variant="h6" component="h2">
          {props.title}
        </Typography>
        <IconButton color="inherit" onClick={props.onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.content}>{children}</DialogContent>
    </Dialog>
  );
};

export default AppDialog;
