import CardTitle from "@dashboard/components/CardTitle";
import Money from "@dashboard/components/Money";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import Skeleton from "@dashboard/components/Skeleton";
import TableCellAvatar from "@dashboard/components/TableCellAvatar";
import TableRowLink from "@dashboard/components/TableRowLink";
import { HomeQuery } from "@dashboard/graphql";
import { productVariantEditUrl } from "@dashboard/products/urls";
import { RelayToFlat } from "@dashboard/types";
import {
  Card,
  CardContent,
  TableBody,
  TableCell,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import { vars } from "@saleor/macaw-ui/next";
import clsx from "clsx";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { maybe, renderCollection } from "../../../misc";

const useStyles = makeStyles(
  theme => ({
    avatarProps: {
      height: 64,
      width: 64,
    },
    colAvatar: {
      paddingBottom: theme.spacing(2),
      paddingRight: theme.spacing(),
      paddingTop: theme.spacing(2),
      width: 112,
    },
    colName: {
      width: "auto",
    },
    label: {
      paddingLeft: 0,
    },
    noProducts: {
      paddingBottom: 20,
      paddingTop: 20,
      paddingLeft: "0 !important",
    },
    tableRow: {
      cursor: "pointer",
      /* Table to be replaced with Box */
      "& .MuiTableCell-root": {
        paddingLeft: `${vars.spacing[5]} !important`,
        paddingRight: `${vars.spacing[5]} !important`,
      },
    },
    cardContent: {
      padding: 0,
    },
    cardTitle: {
      padding: 0,
    },
  }),
  { name: "HomeProductListCard" },
);

interface HomeProductListProps {
  testId?: string;
  topProducts: RelayToFlat<HomeQuery["productTopToday"]>;
}

export const HomeProductList: React.FC<HomeProductListProps> = props => {
  const { topProducts, testId } = props;
  const classes = useStyles(props);

  const intl = useIntl();

  return (
    <Card data-test-id={testId}>
      <CardTitle
        className={classes.cardTitle}
        title={intl.formatMessage({
          id: "rr8fyf",
          defaultMessage: "Top Products",
          description: "header",
        })}
      />
      <CardContent className={classes.cardContent}>
        <ResponsiveTable>
          <colgroup>
            <col className={classes.colAvatar} />
            <col className={classes.colName} />
            <col />
          </colgroup>
          <TableBody>
            {renderCollection(
              topProducts,
              variant => (
                <TableRowLink
                  key={variant ? variant.id : "skeleton"}
                  hover={!!variant}
                  className={clsx({
                    [classes.tableRow]: !!variant,
                  })}
                  href={productVariantEditUrl(variant.product.id, variant.id)}
                >
                  <TableCellAvatar
                    className={classes.colAvatar}
                    thumbnail={maybe(() => variant.product.thumbnail.url)}
                    avatarProps={classes.avatarProps}
                  />

                  <TableCell className={classes.label}>
                    {variant ? (
                      <>
                        <Typography color={"primary"}>
                          {variant.product.name}
                        </Typography>
                        <Typography color={"textSecondary"}>
                          {maybe(() =>
                            variant.attributes
                              .map(attribute => attribute.values[0].name)
                              .join(" / "),
                          )}
                        </Typography>
                        <Typography color={"textSecondary"}>
                          <FormattedMessage
                            id="0opVvi"
                            defaultMessage="{amount, plural,one {One ordered}other {{amount} Ordered}}"
                            description="number of ordered products"
                            values={{
                              amount: variant.quantityOrdered,
                            }}
                          />
                        </Typography>
                      </>
                    ) : (
                      <Skeleton />
                    )}
                  </TableCell>

                  <TableCell>
                    <Typography align={"right"}>
                      {maybe(
                        () => (
                          <Money money={variant.revenue.gross} />
                        ),
                        <Skeleton />,
                      )}
                    </Typography>
                  </TableCell>
                </TableRowLink>
              ),
              () => (
                <TableRowLink>
                  <TableCell colSpan={3} className={classes.noProducts}>
                    <Typography>
                      <FormattedMessage
                        id="Q1Uzbb"
                        defaultMessage="No products found"
                      />
                    </Typography>
                  </TableCell>
                </TableRowLink>
              ),
            )}
          </TableBody>
        </ResponsiveTable>
      </CardContent>
    </Card>
  );
};

HomeProductList.displayName = "HomeProductList";
export default HomeProductList;
