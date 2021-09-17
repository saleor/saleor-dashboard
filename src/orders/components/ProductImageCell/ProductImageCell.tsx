import { TableCell, TableCellProps } from "@material-ui/core";
import InlineAlert from "@saleor/components/Alert/InlineAlert";
import Skeleton from "@saleor/components/Skeleton";
import Avatar from "@saleor/components/TableCellAvatar/Avatar";
import { NotAllowedInvertedIcon } from "@saleor/macaw-ui";
import React from "react";

import { useStyles } from "./styles";

interface ProductImageCellProps extends TableCellProps {
  notAllowed?: boolean;
  notAllowedAlert?: string;
  productThumbnail?: string;
  productName?: string;
}

export const ProductImageCell: React.FC<ProductImageCellProps> = ({
  notAllowed = false,
  notAllowedAlert,
  productThumbnail,
  productName,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <TableCell {...rest}>
      <div className={classes.avatar}>
        {notAllowed && (
          <div className={classes.avatarNotAllowed}>
            <NotAllowedInvertedIcon />
            {notAllowedAlert && (
              <InlineAlert className={classes.alert}>
                {notAllowedAlert}
              </InlineAlert>
            )}
          </div>
        )}
        <Avatar thumbnail={productThumbnail}>
          {productName ? productName : <Skeleton />}
        </Avatar>
      </div>
    </TableCell>
  );
};

ProductImageCell.displayName = "ProductImageCell";
export default ProductImageCell;
