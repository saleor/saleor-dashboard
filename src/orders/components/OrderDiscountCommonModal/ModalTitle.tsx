import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";

const useStyles = makeStyles(
  theme => ({
    container: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: theme.spacing(3, 3, 0, 3)
    }
  }),
  { name: "ModalTitle" }
);

interface ModalTitleProps {
  title: string;
  onClose: () => void;
}

const ModalTitle: React.FC<ModalTitleProps> = ({ title, onClose }) => {
  const classes = useStyles({});

  return (
    <div className={classes.container}>
      <Typography variant="h5">{title}</Typography>
      <CloseIcon onClick={onClose} />
    </div>
  );
};

export default ModalTitle;
