import { IconButton } from "@material-ui/core";
import Link from "@saleor/components/Link";
import AddIcon from "@material-ui/icons/Add";
import React from "react";
import { MessageDescriptor, useIntl } from "react-intl";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(
  theme => ({
    container: {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(2),
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }),
  { name: "CardAddItemsFooter" }
);

interface CardAddItemsFooterProps {
  title: MessageDescriptor;
  onAdd: () => void;
  testIds: {
    link: string;
    button: string;
  };
}

const CardAddItemsFooter: React.FC<CardAddItemsFooterProps> = ({
  title,
  onAdd,
  testIds
}) => {
  const intl = useIntl();
  const classes = useStyles({});

  return (
    <div className={classes.container}>
      <Link data-test-id={testIds.link} onClick={onAdd}>
        {intl.formatMessage(title)}
      </Link>
      <IconButton data-test-id={testIds.button} color="primary" onClick={onAdd}>
        <AddIcon />
      </IconButton>
    </div>
  );
};

export default CardAddItemsFooter;
