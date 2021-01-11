import { makeStyles, TableCell, Typography } from "@material-ui/core";
import { OrderErrorFragment } from "@saleor/fragments/types/OrderErrorFragment";
import ErrorExclamationCircleIcon from "@saleor/icons/ErrorExclamationCircle";
import React, { useState } from "react";
import { defineMessages } from "react-intl";
import { useIntl } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    container: {
      position: "relative"
    },
    errorBox: {
      backgroundColor: "#FE6D76",
      borderRadius: 8,
      padding: `${theme.spacing(2)}px ${theme.spacing(3)}px`,
      position: "absolute",
      right: theme.spacing(3),
      textAlign: "left",
      top: `calc(100% - 8px)`,
      width: 280,
      zIndex: 1000
    },
    errorText: {
      color: "white",
      fontSize: 14
    },
    errorTextHighlighted: {
      color: "#FE6D76",
      fontSize: 12,
      marginRight: theme.spacing(1)
    },
    titleContainer: {
      alignItems: "center",
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end"
    }
  }),
  { name: "ProductErrorCell" }
);

const messages = defineMessages({
  description: {
    defaultMessage:
      "This product is no longer in database so it can’t be replaced, nor returned",
    description: "product no longer exists error description"
  },
  title: {
    defaultMessage: "Product no longer exists",
    description: "product no longer exists error title"
  }
});

interface ProductErrorCellProps {
  lineId: string;
  errors: OrderErrorFragment[];
}

const ProductErrorCell: React.FC<ProductErrorCellProps> = (
  {
    //   errors,
    //   lineId
  }
) => {
  const classes = useStyles({});
  const intl = useIntl();

  const [showErrorBox, setShowErrorBox] = useState<boolean>(false);

  // replace with proper find from errors
  const hasProductError = true;
  const shouldShowErrorBox = showErrorBox && hasProductError;

  return (
    <TableCell align="right" className={classes.container}>
      <div
        className={classes.titleContainer}
        onMouseEnter={() => setShowErrorBox(true)}
        onMouseLeave={() => setShowErrorBox(false)}
      >
        <Typography className={classes.errorTextHighlighted}>
          {intl.formatMessage(messages.title)}
        </Typography>
        <ErrorExclamationCircleIcon />
      </div>
      {shouldShowErrorBox && (
        <div className={classes.errorBox}>
          <Typography className={classes.errorText}>
            {intl.formatMessage(messages.description)}
          </Typography>
        </div>
      )}
    </TableCell>
  );
};

export default ProductErrorCell;
