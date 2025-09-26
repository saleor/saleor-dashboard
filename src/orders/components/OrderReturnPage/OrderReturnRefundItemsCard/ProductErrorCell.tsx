import ErrorExclamationCircleIcon from "@dashboard/icons/ErrorExclamationCircle";
import { Popper, TableCell } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import { Text } from "@saleor/macaw-ui-next";
import { useRef, useState } from "react";
import { defineMessages, useIntl } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    container: {
      position: "relative",
    },
    errorBox: {
      backgroundColor: theme.palette.error.main,
      borderRadius: 8,
      marginRight: theme.spacing(3),
      padding: theme.spacing(2, 3),
      width: 280,
      zIndex: 1000,
    },
    errorText: {
      color: "white",
      fontSize: 14,
    },
    errorTextHighlighted: {
      color: theme.palette.error.main,
      fontSize: 12,
      marginRight: theme.spacing(1),
    },
    titleContainer: {
      alignItems: "center",
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end",
    },
  }),
  { name: "ProductErrorCell" },
);
const messages = defineMessages({
  description: {
    id: "RlbhwF",
    defaultMessage: "This product is no longer in database so it can’t be replaced, nor returned",
    description: "product no longer exists error description",
  },
  title: {
    id: "p4zuQp",
    defaultMessage: "Product no longer exists",
    description: "product no longer exists error title",
  },
});

interface ProductErrorCellProps {
  hasVariant: boolean;
}

const ProductErrorCell = ({ hasVariant }: ProductErrorCellProps) => {
  const classes = useStyles({});
  const intl = useIntl();
  const popperAnchorRef = useRef<HTMLButtonElement | null>(null);
  const [showErrorBox, setShowErrorBox] = useState<boolean>(false);

  if (hasVariant) {
    return <TableCell />;
  }

  return (
    <TableCell align="right" className={classes.container} ref={popperAnchorRef}>
      <div
        className={classes.titleContainer}
        onMouseEnter={() => setShowErrorBox(true)}
        onMouseLeave={() => setShowErrorBox(false)}
      >
        <Text className={classes.errorTextHighlighted}>{intl.formatMessage(messages.title)}</Text>
        <ErrorExclamationCircleIcon />
      </div>
      <Popper placement="bottom-end" open={showErrorBox} anchorEl={popperAnchorRef.current}>
        <div className={classes.errorBox}>
          <Text className={classes.errorText}>{intl.formatMessage(messages.description)}</Text>
        </div>
      </Popper>
    </TableCell>
  );
};

export default ProductErrorCell;
