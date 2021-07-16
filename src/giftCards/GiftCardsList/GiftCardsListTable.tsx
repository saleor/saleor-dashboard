import {
  Card,
  Checkbox,
  makeStyles,
  TableBody,
  TableCell,
  TableRow,
  Typography
} from "@material-ui/core";
import HorizontalSpacer from "@saleor/apps/components/HorizontalSpacer";
import Link from "@saleor/components/Link";
import Money from "@saleor/components/Money";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import TableCellHeader, {
  TableCellHeaderProps
} from "@saleor/components/TableCellHeader";
import TableHead from "@saleor/components/TableHead";
import { customerUrl } from "@saleor/customers/urls";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { renderCollection } from "@saleor/misc";
import Label, {
  LabelSizes
} from "@saleor/orders/components/OrderHistory/Label";
import { productUrl } from "@saleor/products/urls";
import faker from "faker";
import { capitalize } from "lodash-es";
import React from "react";
import { MessageDescriptor, useIntl } from "react-intl";

import { giftCardsListTableMessages as messages } from "./messages";

const numberOfColumns = 5;

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

// TEMP DATA
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

const useStyles = makeStyles(
  () => ({
    moneyContainer: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "flex-end"
    }
  }),
  { name: "GiftCardsListTable" }
);

interface GiftCardsListTableProps {}

interface HeaderItem {
  title: MessageDescriptor;
  options?: TableCellHeaderProps;
}

const GiftCardsListTable: React.FC<GiftCardsListTableProps> = ({}) => {
  const intl = useIntl();
  const classes = useStyles({});
  const navigate = useNavigator();

  const headerItems: HeaderItem[] = [
    {
      title: messages.giftCardsTableColumnGiftCardTitle
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
        textAlign: "right"
      }
    }
  ];

  return (
    <Card>
      <ResponsiveTable>
        <TableHead
          colSpan={numberOfColumns}
          // selected={selected}
          // disabled={disabled}
          // items={collections}
          // toggleAll={toggleAll}
          // toolbar={toolbar}
        >
          {headerItems.map(({ title, options }) => (
            <TableCellHeader {...options}>
              <Label text={intl.formatMessage(title)} size={LabelSizes.md} />
            </TableCellHeader>
          ))}
        </TableHead>
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
              <TableRow key={id}>
                <TableCell padding="checkbox">
                  <Checkbox
                  //   checked={isSelected}
                  //   disabled={disabled}
                  //   disableClickPropagation
                  //   onChange={() => toggle(collection.id)}
                  />
                </TableCell>
                <TableCell>
                  <Typography>
                    {`${intl.formatMessage(
                      messages.codeEndingWithLabel
                    )} ${displayCode}`}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{tag || "-"}</Typography>
                </TableCell>
                <TableCell>
                  <Link onClick={() => navigate(productUrl(product?.id))}>
                    {product?.name || "-"}
                  </Link>
                </TableCell>
                <TableCell>
                  {usedBy ? (
                    <Link onClick={() => navigate(customerUrl(usedBy?.id))}>
                      <Typography>
                        {`${usedBy?.firstName} ${usedBy?.lastName}`}
                      </Typography>
                    </Link>
                  ) : (
                    <Typography>{usedByEmail}</Typography>
                  )}
                </TableCell>
                <TableCell align="right">
                  <div className={classes.moneyContainer}>
                    <Typography variant="caption">
                      {currentBalance.currency}
                    </Typography>
                    <HorizontalSpacer spacing={0.5} />
                    <Typography>{currentBalance.amount}</Typography>
                  </div>
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
