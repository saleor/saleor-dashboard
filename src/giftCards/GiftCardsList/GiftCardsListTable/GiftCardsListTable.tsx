import {
  Card,
  TableBody,
  TableCell,
  TableRow,
  Typography
} from "@material-ui/core";
import HorizontalSpacer from "@saleor/apps/components/HorizontalSpacer";
import Checkbox from "@saleor/components/Checkbox";
import DeleteIconButton from "@saleor/components/DeleteIconButton";
import Link from "@saleor/components/Link";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import StatusChip from "@saleor/components/StatusChip";
import { StatusType } from "@saleor/components/StatusChip/types";
import { customerUrl } from "@saleor/customers/urls";
import useNavigator from "@saleor/hooks/useNavigator";
import { renderCollection } from "@saleor/misc";
import { productUrl } from "@saleor/products/urls";
import React, { useContext } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { GiftCardsListContext } from "../GiftCardsListProvider";
import { giftCardsListTableMessages as messages } from "../messages";
import { useTableStyles as useStyles } from "../styles";
import GiftCardsListTableFooter from "./GiftCardsListTableFooter";
import GiftCardsListTableHeader from "./GiftCardsListTableHeader";

const numberOfColumns = 7;

// interface GiftCardsListTableProps {}

const GiftCardsListTable: React.FC = ({}) => {
  const intl = useIntl();
  const classes = useStyles({});
  const navigate = useNavigator();
  const { toggle, isSelected, giftCards } = useContext(GiftCardsListContext);

  const commonTableProps = {
    numberOfColumns
    // disabled
  };

  return (
    <Card>
      <ResponsiveTable>
        <GiftCardsListTableHeader {...commonTableProps} />
        <GiftCardsListTableFooter {...commonTableProps} />
        <TableBody>
          {renderCollection(
            giftCards,
            ({
              id,
              displayCode,
              usedBy,
              usedByEmail,
              tag,
              isActive,
              product,
              currentBalance
            }) => (
              <TableRow className={classes.row} key={id}>
                <TableCell padding="checkbox">
                  <Checkbox
                    disableClickPropagation
                    checked={isSelected(id)}
                    onChange={() => toggle(id)}
                  />
                </TableCell>
                <TableCell className={classes.colCardCode}>
                  <div className={classes.cardCodeContainer}>
                    <Typography>
                      {`${intl.formatMessage(
                        messages.codeEndingWithLabel
                      )} ${displayCode}`}
                    </Typography>
                    {!isActive && (
                      <>
                        <HorizontalSpacer spacing={2} />
                        <StatusChip
                          size="md"
                          status={StatusType.ERROR}
                          label={intl.formatMessage(
                            messages.giftCardDisabledLabel
                          )}
                        />
                      </>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Typography>{tag || "-"}</Typography>
                </TableCell>
                <TableCell className={classes.row}>
                  {product ? (
                    <Link onClick={() => navigate(productUrl(product?.id))}>
                      {product?.name}
                    </Link>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell className={classes.row}>
                  {usedBy ? (
                    <Link onClick={() => navigate(customerUrl(usedBy?.id))}>
                      {`${usedBy?.firstName} ${usedBy?.lastName}`}
                    </Link>
                  ) : (
                    <Typography noWrap>{usedByEmail}</Typography>
                  )}
                </TableCell>
                <TableCell align="right" className={classes.colBalance}>
                  <div className={classes.moneyContainer}>
                    <Typography variant="caption">
                      {currentBalance.currency}
                    </Typography>
                    <HorizontalSpacer spacing={0.5} />
                    <Typography>{currentBalance.amount}</Typography>
                  </div>
                </TableCell>
                <TableCell className={classes.colDelete} colSpan={1}>
                  <DeleteIconButton />
                </TableCell>
              </TableRow>
            ),
            () => (
              <TableRow>
                <TableCell colSpan={numberOfColumns}>
                  <FormattedMessage {...messages.noGiftCardsFound} />
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </ResponsiveTable>
    </Card>
  );
};

export default GiftCardsListTable;
