import { makeStyles } from "@material-ui/core/styles";
import TrashIcon from "@saleor/icons/Trash";
import React from "react";

const useStyles = makeStyles(
  theme => ({
    container: {
      cursor: "pointer",
      padding: theme.spacing(3),
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }
  }),
  { name: "DeletableItem" }
);

interface DeletableItemProps {
  onDelete: (id: string) => void;
  id: string;
}

const DeletableItem: React.FC<DeletableItemProps> = ({ onDelete, id }) => {
  const classes = useStyles({});

  const handleDelete = () => onDelete(id);

  return (
    <div className={classes.container} onClick={handleDelete}>
      <TrashIcon />
    </div>
  );
};

export default DeletableItem;
