import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import { makeStyles } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import classNames from "classnames";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import TableCellAvatar from "@saleor/components/TableCellAvatar";
import { maybe, renderCollection } from "../../../misc";
import { ProductVariantCreateData_product_variants } from "../../types/ProductVariantCreateData";
import { ProductVariantDetails_productVariant } from "../../types/ProductVariantDetails";

const useStyles = makeStyles(
  theme => ({
    colName: {
      paddingLeft: 0,
      textAlign: [["left"], "!important"] as any
    },
    link: {
      cursor: "pointer"
    },
    tabActive: {
      "&:before": {
        background: theme.palette.primary.main,
        content: '""',
        height: "100%",
        left: 0,
        position: "absolute",
        top: 0,
        width: 2
      },
      position: "relative"
    }
  }),
  { name: "ProductVariantNavigation" }
);

interface ProductVariantNavigationProps {
  current?: string;
  fallbackThumbnail: string;
  variants:
    | ProductVariantDetails_productVariant[]
    | ProductVariantCreateData_product_variants[];
  onAdd?: () => void;
  onRowClick: (variantId: string) => void;
}

const ProductVariantNavigation: React.FC<
  ProductVariantNavigationProps
> = props => {
  const { current, fallbackThumbnail, variants, onAdd, onRowClick } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Variants",
          description: "section header"
        })}
      />
      <ResponsiveTable>
        <TableBody>
          {renderCollection(variants, variant => (
            <TableRow
              hover={!!variant}
              key={variant ? variant.id : "skeleton"}
              className={classes.link}
              onClick={variant ? () => onRowClick(variant.id) : undefined}
            >
              <TableCellAvatar
                className={classNames({
                  [classes.tabActive]: variant && variant.id === current
                })}
                thumbnail={maybe(
                  () => variant.images[0].url,
                  fallbackThumbnail
                )}
              />
              <TableCell className={classes.colName}>
                {variant ? variant.name || variant.sku : <Skeleton />}
              </TableCell>
            </TableRow>
          ))}
          {onAdd ? (
            <TableRow>
              <TableCell colSpan={2}>
                <Button color="primary" onClick={onAdd}>
                  <FormattedMessage
                    defaultMessage="Add variant"
                    description="button"
                  />
                </Button>
              </TableCell>
            </TableRow>
          ) : (
            <TableRow>
              <TableCellAvatar className={classes.tabActive} thumbnail={null} />
              <TableCell className={classes.colName}>
                <FormattedMessage
                  defaultMessage="New Variant"
                  description="variant name"
                />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </ResponsiveTable>
    </Card>
  );
};
ProductVariantNavigation.displayName = "ProductVariantNavigation";
export default ProductVariantNavigation;
