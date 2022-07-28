import AddIcon from "@material-ui/icons/Add";
import Link from "@saleor/components/Link";
import { IconButton, makeStyles } from "@saleor/macaw-ui";
import React, { MutableRefObject } from "react";

const useStyles = makeStyles(
  theme => ({
    container: {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      position: "relative",
    },
  }),
  { name: "CardAddItemsFooter" },
);

interface CardAddItemsFooterProps {
  title: string;
  onAdd: () => void;
  testIds: {
    link: string;
    button: string;
  };
  ref?: MutableRefObject<HTMLDivElement>;
}

const CardAddItemsFooter: React.FC<CardAddItemsFooterProps> = ({
  title,
  onAdd,
  testIds,
  ref,
  children,
}) => {
  const classes = useStyles({});

  return (
    <div className={classes.container} ref={ref}>
      <Link data-test-id={testIds.link} onClick={onAdd}>
        {title}
      </Link>
      <IconButton
        variant="secondary"
        data-test-id={testIds.button}
        color="primary"
        onClick={onAdd}
      >
        <AddIcon />
      </IconButton>
      {children}
    </div>
  );
};

export default CardAddItemsFooter;
