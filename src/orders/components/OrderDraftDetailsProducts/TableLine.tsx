import { TableCell, TableRow, Typography } from "@material-ui/core";
import Link from "@saleor/components/Link";
import Money from "@saleor/components/Money";
import TableCellAvatar from "@saleor/components/TableCellAvatar";
import { AVATAR_MARGIN } from "@saleor/components/TableCellAvatar/Avatar";
import { OrderLineFragment, OrderLineInput } from "@saleor/graphql";
import {
  DeleteIcon,
  IconButton,
  IndicatorOutlined,
  makeStyles,
  Tooltip,
  TooltipMountWrapper,
} from "@saleor/macaw-ui";
import { OrderLineDiscountContextConsumerProps } from "@saleor/products/components/OrderDiscountProviders/OrderLineDiscountProvider";
import classNames from "classnames";
import React, { useRef } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { maybe } from "../../../misc";
import OrderDiscountCommonModal from "../OrderDiscountCommonModal";
import { ORDER_LINE_DISCOUNT } from "../OrderDiscountCommonModal/types";
import { lineAlertMessages } from "./mssages";
import TableLineForm from "./TableLineForm";

const useStyles = makeStyles(
  theme => ({
    colStatusEmpty: {
      "&:first-child:not(.MuiTableCell-paddingCheckbox)": {
        paddingRight: 0,
      },
    },
    colAction: {
      width: `calc(76px + ${theme.spacing(0.5)})`,
    },
    colName: {
      width: "auto",
    },
    colNameLabel: {
      marginLeft: AVATAR_MARGIN,
    },
    colPrice: {
      textAlign: "right",
    },
    colQuantity: {
      textAlign: "right",
    },
    colTotal: {
      textAlign: "right",
    },
    strike: {
      textDecoration: "line-through",
      color: theme.palette.grey[400],
    },
  }),
  { name: "OrderDraftDetailsProducts" },
);

interface TableLineProps extends OrderLineDiscountContextConsumerProps {
  line: OrderLineFragment;
  channelId: string;
  onOrderLineChange: (id: string, data: OrderLineInput) => void;
  onOrderLineRemove: (id: string) => void;
}

const TableLine: React.FC<TableLineProps> = ({
  line,
  channelId,
  onOrderLineChange,
  onOrderLineRemove,
  orderLineDiscount,
  addOrderLineDiscount,
  removeOrderLineDiscount,
  openDialog,
  closeDialog,
  orderLineDiscountRemoveStatus,
  isDialogOpen,
  undiscountedPrice,
  discountedPrice,
  orderLineDiscountUpdateStatus,
}) => {
  const classes = useStyles();
  const intl = useIntl();
  const popperAnchorRef = useRef<HTMLTableRowElement | null>(null);
  const {
    id,
    thumbnail,
    productName,
    productSku,
    quantity,
    variant: {
      product: { channelListings },
    },
  } = line;

  const channelListing = channelListings.find(
    channelListing => channelListing.channel.id === channelId,
  );
  const isPublished = channelListing?.isPublished;
  const isAvailable = channelListing?.isAvailableForPurchase;

  const getUnitPriceLabel = () => {
    const money = <Money money={undiscountedPrice} />;

    if (!!orderLineDiscount) {
      return (
        <>
          <Typography className={classes.strike}>{money}</Typography>
          <Link onClick={openDialog}>
            <Money money={discountedPrice} />
          </Link>
        </>
      );
    }

    return <Link onClick={openDialog}>{money}</Link>;
  };

  const getAlert = () => {
    if (!isPublished && !isAvailable) {
      return (
        <ul>
          <li>
            <FormattedMessage {...lineAlertMessages.notPublished} />
          </li>
          <li>
            <FormattedMessage {...lineAlertMessages.notAvailable} />
          </li>
        </ul>
      );
    }
    if (!isPublished) {
      return intl.formatMessage(lineAlertMessages.notPublished);
    }
    if (!isAvailable) {
      return intl.formatMessage(lineAlertMessages.notAvailable);
    }
    return "";
  };

  return (
    <TableRow key={id}>
      <TableCell
        className={classNames({
          [classes.colStatusEmpty]: isPublished && isAvailable,
        })}
      >
        {(!isPublished || !isAvailable) && (
          <Tooltip title={getAlert()} variant="warning">
            <TooltipMountWrapper>
              <IndicatorOutlined icon="warning" />
            </TooltipMountWrapper>
          </Tooltip>
        )}
      </TableCell>
      <TableCellAvatar
        className={classes.colName}
        thumbnail={maybe(() => thumbnail.url)}
      >
        <Typography variant="body2">{productName}</Typography>
        <Typography variant="caption">{productSku}</Typography>
      </TableCellAvatar>
      <TableCell className={classes.colQuantity}>
        <TableLineForm line={line} onOrderLineChange={onOrderLineChange} />
      </TableCell>
      <TableCell className={classes.colPrice} ref={popperAnchorRef}>
        {getUnitPriceLabel()}
        <OrderDiscountCommonModal
          isOpen={isDialogOpen}
          anchorRef={popperAnchorRef}
          onClose={closeDialog}
          modalType={ORDER_LINE_DISCOUNT}
          maxPrice={undiscountedPrice}
          onConfirm={addOrderLineDiscount}
          onRemove={removeOrderLineDiscount}
          existingDiscount={orderLineDiscount}
          confirmStatus={orderLineDiscountUpdateStatus}
          removeStatus={orderLineDiscountRemoveStatus}
          dialogPlacement="bottom-end"
        />
      </TableCell>
      <TableCell className={classes.colTotal}>
        <Money
          money={{
            amount: discountedPrice.amount * quantity,
            currency: discountedPrice.currency,
          }}
        />
      </TableCell>
      <TableCell className={classes.colAction}>
        <IconButton variant="secondary" onClick={() => onOrderLineRemove(id)}>
          <DeleteIcon color="primary" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default TableLine;
