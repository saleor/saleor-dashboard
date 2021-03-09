import { makeStyles } from "@material-ui/core/styles";
import TrashIcon from "@saleor/icons/Trash";
import React from "react";

const useStyles = makeStyles(
  theme => ({
    container: {
      padding: theme.spacing(3),
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }
  }),
  { name: "DeletableItem" }
);

interface DeletableItemProps {
  onDelete: () => void;
}

const DeletableItem: React.FC<DeletableItemProps> = () => {
  const classes = useStyles({});

  return (
    <div className={classes.container}>
      <TrashIcon />
    </div>
  );
};

export default DeletableItem;
