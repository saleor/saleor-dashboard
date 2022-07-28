import { Divider, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import CardSpacer from "@saleor/components/CardSpacer";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";

const useStyles = makeStyles(
  theme => ({
    container: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: theme.spacing(3, 3, 0, 3),
    },
  }),
  { name: "ModalTitle" },
);

interface ModalTitleProps {
  title: string;
  onClose: () => void;
  withBorder?: boolean;
}

const ModalTitle: React.FC<ModalTitleProps> = ({
  title,
  onClose,
  withBorder = false,
}) => {
  const classes = useStyles({});

  return (
    <>
      <div className={classes.container}>
        <Typography variant="h5">{title}</Typography>
        <CloseIcon onClick={onClose} />
      </div>
      {withBorder && (
        <>
          <CardSpacer />
          <Divider />
        </>
      )}
    </>
  );
};

export default ModalTitle;
