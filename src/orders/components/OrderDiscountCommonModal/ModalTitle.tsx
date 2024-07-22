import CardSpacer from "@dashboard/components/CardSpacer";
import { Divider } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@saleor/macaw-ui";
import { Text } from "@saleor/macaw-ui-next";
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
    closeIcon: {
      cursor: "pointer",
    },
  }),
  { name: "ModalTitle" },
);

interface ModalTitleProps {
  title: string;
  onClose: () => void;
  withBorder?: boolean;
}

const ModalTitle: React.FC<ModalTitleProps> = ({ title, onClose, withBorder = false }) => {
  const classes = useStyles({});

  return (
    <>
      <div className={classes.container}>
        <Text size={3} fontWeight="bold" lineHeight={2}>
          {title}
        </Text>
        <CloseIcon className={classes.closeIcon} onClick={onClose} />
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
