import ErrorExclamationCircleIcon from "@dashboard/icons/ErrorExclamationCircle";
import { Popper, TableCell } from "@material-ui/core";
import { Text } from "@saleor/macaw-ui-next";
import { useRef, useState } from "react";
import { useIntl } from "react-intl";

import { productErrorCellMessages } from "./messages";
import { useProductErrorCellStyles } from "./styles";

interface ProductErrorCellProps {
  hasVariant: boolean;
}

export const ProductErrorCell = ({ hasVariant }: ProductErrorCellProps) => {
  const classes = useProductErrorCellStyles({});
  const intl = useIntl();
  const popperAnchorRef = useRef<HTMLButtonElement | null>(null);
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
        <Text className={classes.errorTextHighlighted}>
          {intl.formatMessage(productErrorCellMessages.title)}
        </Text>
        <ErrorExclamationCircleIcon />
      </div>
      <Popper
        placement="bottom-end"
        data-test-id="product-error-popup"
        open={showErrorBox}
        anchorEl={popperAnchorRef.current}
      >
        <div className={classes.errorBox}>
          <Text className={classes.errorText}>
            {intl.formatMessage(productErrorCellMessages.description)}
          </Text>
        </div>
      </Popper>
    </TableCell>
  );
};
