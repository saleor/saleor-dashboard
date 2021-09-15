import { TableCell } from "@material-ui/core";
import InlineAlert from "@saleor/components/Alert/InlineAlert";
import Skeleton from "@saleor/components/Skeleton";
import Avatar from "@saleor/components/TableCellAvatar/Avatar";
import React from "react";

import { NotAllowedInverted } from "../NotAllowedInverted";
import { useStyles } from "./styles";

interface ProductImageCellProps {
  notAllowed?: boolean;
  notAllowedAlert?: string;
  productThumbnail?: string;
  productName?: string;
}

export const ProductImageCell: React.FC<ProductImageCellProps> = ({
  notAllowed = false,
  notAllowedAlert,
  productThumbnail,
  productName
}) => {
  const classes = useStyles();

  return (
    <TableCell>
      <div className={classes.avatar}>
        {notAllowed && (
          <div className={classes.avatarNotAllowed}>
            <NotAllowedInverted />
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
