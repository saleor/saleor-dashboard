import ErrorExclamationCircleIcon from "@dashboard/icons/ErrorExclamationCircle";
import { Popper, TableCell, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { useIntl } from "react-intl";

import { productErrorCellMessages } from "./messages";
import { useProductErrorCellStyles } from "./styles";

interface ProductErrorCellProps {
  hasVariant: boolean;
}

export const ProductErrorCell: React.FC<ProductErrorCellProps> = ({ hasVariant }) => {
  const classes = useProductErrorCellStyles({});
  const intl = useIntl();
  const popperAnchorRef = React.useRef<HTMLButtonElement | null>(null);
  const [showErrorBox, setShowErrorBox] = useState<boolean>(false);

  if (hasVariant) {
    return <TableCell />;
  }

  return (
    <TableCell align="right" className={classes.container} ref={popperAnchorRef}>
      <div
        data-test-id="product-error-message"
        className={classes.titleContainer}
        onMouseEnter={() => setShowErrorBox(true)}
        onMouseLeave={() => setShowErrorBox(false)}
      >
        <Typography className={classes.errorTextHighlighted}>
          {intl.formatMessage(productErrorCellMessages.title)}
        </Typography>
        <ErrorExclamationCircleIcon />
      </div>
      <Popper
        placement="bottom-end"
        data-test-id="product-error-popup"
        open={showErrorBox}
        anchorEl={popperAnchorRef.current}
      >
        <div className={classes.errorBox}>
          <Typography className={classes.errorText}>
            {intl.formatMessage(productErrorCellMessages.description)}
          </Typography>
        </div>
      </Popper>
    </TableCell>
  );
};
