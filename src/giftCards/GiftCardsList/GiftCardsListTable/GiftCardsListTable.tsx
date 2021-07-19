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
import TableCellHeader, {
  TableCellHeaderProps
} from "@saleor/components/TableCellHeader";
import TableHead from "@saleor/components/TableHead";
import { customerUrl } from "@saleor/customers/urls";
import { BulkActions } from "@saleor/hooks/useBulkActions";
import useNavigator from "@saleor/hooks/useNavigator";
import { renderCollection } from "@saleor/misc";
import Label, {
  LabelSizes
} from "@saleor/orders/components/OrderHistory/Label";
import { productUrl } from "@saleor/products/urls";
import faker from "faker";
import { capitalize } from "lodash-es";
import React from "react";
import { FormattedMessage, MessageDescriptor, useIntl } from "react-intl";

import { giftCardsListTableMessages as messages } from "../messages";
import { useTableStyles as useStyles } from "../styles";
import GiftCardsListTableFooter from "./GiftCardsListTableFooter";

const numberOfColumns = 7;

// TEMP DATA & HELPERS
const getNumbersString = (num: number) => {
  const numString = num.toString();

  switch (numString.length) {
    case 4:
      return numString;

    case 3:
      return `0${numString}`;
    case 2:
      return `00${numString}`;
    default:
      return `000${numString}`;
  }
};

const displayAtRandom = yes => (faker.datatype.boolean() ? yes : null);

const giftCards = new Array(150).fill(null).map(() => ({
  id: faker.datatype.uuid(),
  displayCode: getNumbersString(faker.datatype.number({ min: 0, max: 9999 })),
  usedBy: displayAtRandom({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    id: faker.datatype.uuid()
  }),
  usedByEmail: faker.internet.email().toLowerCase(),
  tag: displayAtRandom(capitalize(faker.lorem.words(2))),
  isActive: faker.datatype.boolean(),
  product: displayAtRandom({
    name: faker.commerce.productName(),
    id: faker.datatype.uuid()
  }),
  currentBalance: {
    currency: "USD",
    amount: parseFloat(faker.finance.amount(1, 999))
  }
}));

interface GiftCardsListTableProps {
  bulkActions: BulkActions;
}

interface HeaderItem {
  title?: MessageDescriptor;
  options?: TableCellHeaderProps;
}

const GiftCardsListTable: React.FC<GiftCardsListTableProps> = ({
  bulkActions
}) => {
  const intl = useIntl();
  const classes = useStyles({});
  const navigate = useNavigator();
  const { toggleAll, toggle, isSelected, listElements } = bulkActions;

  const headerItems: HeaderItem[] = [
    {
      title: messages.giftCardsTableColumnGiftCardTitle,
      options: {
        className: classes.colCardCode,
        textAlign: "left"
      }
    },
    {
      title: messages.giftCardsTableColumnTagTitle
    },
    {
      title: messages.giftCardsTableColumnProductTitle
    },
    {
      title: messages.giftCardsTableColumnCustomerTitle
    },
    {
      title: messages.giftCardsTableColumnBalanceTitle,
      options: {
        className: classes.colBalance,
        textAlign: "right"
      }
    }
  ];

  return (
    <Card>
      <ResponsiveTable>
        <TableHead
          colSpan={numberOfColumns}
          selected={listElements.length}
          // disabled={}
          items={giftCards}
          toggleAll={toggleAll}
        >
          {headerItems.map(({ title, options }) => (
            <TableCellHeader {...options}>
              <Label text={intl.formatMessage(title)} size={LabelSizes.md} />
            </TableCellHeader>
          ))}
          <TableCell className={classes.colDelete} />
        </TableHead>
        <GiftCardsListTableFooter
          numberOfColumns={numberOfColumns}
          pageInfo={giftCards?.pageInfo}
        />
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
