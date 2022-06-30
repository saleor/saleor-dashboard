import { Divider, Typography } from "@material-ui/core";
import DeletableItem from "@saleor/components/DeletableItem";
import React from "react";

import { useStyles } from "./styles";
import { AssignItem } from "./types";

interface ItemProps {
  item: AssignItem;
  onDelete: (id: string) => void;
}

const Item: React.FC<ItemProps> = ({ item, onDelete }) => {
  const { id, name } = item;
  const classes = useStyles();

  return (
    <>
      <div className={classes.container}>
        <Typography>{name}</Typography>
        <DeletableItem id={id} onDelete={onDelete} />
      </div>
      <Divider />
    </>
  );
};

export default Item;
