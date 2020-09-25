import Card from "@material-ui/core/Card";
import { makeStyles } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import CardTitle from "@saleor/components/CardTitle";
import Money from "@saleor/components/Money";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import TableCellAvatar from "@saleor/components/TableCellAvatar";
import classNames from "classnames";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { maybe, renderCollection } from "../../../misc";
import { Home_productTopToday_edges_node } from "../../types/Home";

const useStyles = makeStyles(
  theme => ({
    avatarProps: {
      height: 64,
      width: 64
    },
    colAvatar: {
      paddingBottom: theme.spacing(2),
      paddingRight: theme.spacing(),
      paddingTop: theme.spacing(2),
      width: 112
    },
    colName: {
      width: "auto"
    },
    label: {
      paddingLeft: 0
    },
    noProducts: {
      paddingBottom: 20,
      paddingTop: 20
    },
    tableRow: {
      cursor: "pointer"
    }
  }),
  { name: "HomeProductListCard" }
);

interface HomeProductListProps {
  topProducts: Home_productTopToday_edges_node[];
  onRowClick: (productId: string, variantId: string) => void;
}

export const HomeProductList: React.FC<HomeProductListProps> = props => {
  const { topProducts, onRowClick } = props;
  const classes = useStyles(props);

  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Top Products",
          description: "header",
          id: "homeProductsListCardHeader"
        })}
      />
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
              <TableRow
                key={variant ? variant.id : "skeleton"}
                hover={!!variant}
                className={classNames({
                  [classes.tableRow]: !!variant
                })}
                onClick={
                  !!variant
                    ? () => onRowClick(variant.product.id, variant.id)
                    : undefined
                }
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
                            .join(" / ")
                        )}
                      </Typography>
                      <Typography color={"textSecondary"}>
                        <FormattedMessage
                          defaultMessage="{amount, plural,one {One ordered}other {{amount} Ordered}}"
                          description="number of ordered products"
                          id="homeProductListCardOrders"
                          values={{
                            amount: variant.quantityOrdered
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
                      <Skeleton />
                    )}
                  </Typography>
                </TableCell>
              </TableRow>
            ),
            () => (
              <TableRow>
                <TableCell colSpan={3} className={classes.noProducts}>
                  <Typography>
                    <FormattedMessage
                      defaultMessage="No products found"
                      id="homeProductsListCardNoProducts"
                    />
                  </Typography>
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </ResponsiveTable>
    </Card>
  );
};

HomeProductList.displayName = "HomeProductList";
export default HomeProductList;
