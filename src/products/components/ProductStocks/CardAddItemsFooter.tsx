import { IconButton } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import Link from "@saleor/components/Link";
import { makeStyles } from "@saleor/theme";
import React, { MutableRefObject } from "react";
import { MessageDescriptor, useIntl } from "react-intl";

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
      alignItems: "center",
      width: "100%",
      position: "relative"
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
  ref?: MutableRefObject<HTMLDivElement>;
}

const CardAddItemsFooter: React.FC<CardAddItemsFooterProps> = ({
  title,
  onAdd,
  testIds,
  ref,
  children
}) => {
  const intl = useIntl();
  const classes = useStyles({});

  return (
    <div className={classes.container} ref={ref}>
      <Link data-test-id={testIds.link} onClick={onAdd}>
        {intl.formatMessage(title)}
      </Link>
      <IconButton data-test-id={testIds.button} color="primary" onClick={onAdd}>
        <AddIcon />
      </IconButton>
      {children}
    </div>
  );
};

export default CardAddItemsFooter;
