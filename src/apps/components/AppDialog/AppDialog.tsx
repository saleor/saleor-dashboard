import { Dialog, DialogContent, DialogProps, DialogTitle, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { Text } from "@saleor/macaw-ui-next";
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
        <Text fontWeight="bold" lineHeight={2} as="h2">
          {props.title}
        </Text>
        <IconButton color="inherit" onClick={props.onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.content}>{children}</DialogContent>
    </Dialog>
  );
};

export default AppDialog;
