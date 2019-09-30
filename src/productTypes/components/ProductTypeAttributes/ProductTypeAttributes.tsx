import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import IconButton from "@material-ui/core/IconButton";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import DeleteIcon from "@material-ui/icons/Delete";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import Checkbox from "@saleor/components/Checkbox";
import Skeleton from "@saleor/components/Skeleton";
import {
  SortableTableBody,
  SortableTableRow
} from "@saleor/components/SortableTable";
import TableHead from "@saleor/components/TableHead";
import { maybe, renderCollection, stopPropagation } from "@saleor/misc";
import { ListActions, ReorderAction } from "@saleor/types";
import { AttributeTypeEnum } from "@saleor/types/globalTypes";
import {
  ProductTypeDetails_productType_productAttributes,
  ProductTypeDetails_productType_variantAttributes
} from "../../types/ProductTypeDetails";

const styles = (theme: Theme) =>
  createStyles({
    colName: {},
    colSlug: {
      width: 300
    },
    iconCell: {
      "&:last-child": {
        paddingRight: 0
      },
      width: 48 + theme.spacing.unit * 1.5
    },
    link: {
      cursor: "pointer"
    },
    textLeft: {
      textAlign: "left"
    }
  });

interface ProductTypeAttributesProps extends ListActions {
  attributes:
    | ProductTypeDetails_productType_productAttributes[]
    | ProductTypeDetails_productType_variantAttributes[];
  disabled: boolean;
  type: string;
  onAttributeAssign: (type: AttributeTypeEnum) => void;
  onAttributeClick: (id: string) => void;
  onAttributeReorder: ReorderAction;
  onAttributeUnassign: (id: string) => void;
}

const numberOfColumns = 5;

const ProductTypeAttributes = withStyles(styles, {
  name: "ProductTypeAttributes"
})(
  ({
    attributes,
    classes,
    disabled,
    isChecked,
    selected,
    toggle,
    toggleAll,
    toolbar,
    type,
    onAttributeAssign,
    onAttributeClick,
    onAttributeReorder,
    onAttributeUnassign
  }: ProductTypeAttributesProps & WithStyles<typeof styles>) => {
    const intl = useIntl();

    return (
      <Card
        data-tc={
          type === AttributeTypeEnum.PRODUCT
            ? "product-attributes"
            : "variant-attributes"
        }
      >
        <CardTitle
          title={
            type === AttributeTypeEnum.PRODUCT
              ? intl.formatMessage({
                  defaultMessage: "Product Attributes",
                  description: "section header"
                })
              : intl.formatMessage({
                  defaultMessage: "Variant Attributes",
                  description: "section header"
                })
          }
          toolbar={
            <Button
              color="primary"
              variant="text"
              onClick={() => onAttributeAssign(AttributeTypeEnum[type])}
            >
              <FormattedMessage
                defaultMessage="Assign attribute"
                description="button"
              />
            </Button>
          }
        />
        <Table>
          <TableHead
            colSpan={numberOfColumns}
            disabled={disabled}
            dragRows
            selected={selected}
            items={attributes}
            toggleAll={toggleAll}
            toolbar={toolbar}
          >
            <TableCell className={classes.colName}>
              <FormattedMessage defaultMessage="Attribute name" />
            </TableCell>
            <TableCell className={classes.colName}>
              <FormattedMessage
                defaultMessage="Slug"
                description="attribute internal name"
              />
            </TableCell>
            <TableCell />
          </TableHead>
          <SortableTableBody onSortEnd={onAttributeReorder}>
            {renderCollection(
              attributes,
              (attribute, attributeIndex) => {
                const isSelected = attribute ? isChecked(attribute.id) : false;

                return (
                  <SortableTableRow
                    selected={isSelected}
                    className={!!attribute ? classes.link : undefined}
                    hover={!!attribute}
                    onClick={
                      !!attribute
                        ? () => onAttributeClick(attribute.id)
                        : undefined
                    }
                    key={maybe(() => attribute.id)}
                    index={attributeIndex || 0}
                    data-tc="id"
                    data-tc-id={maybe(() => attribute.id)}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        disabled={disabled}
                        disableClickPropagation
                        onChange={() => toggle(attribute.id)}
                      />
                    </TableCell>
                    <TableCell className={classes.colName} data-tc="name">
                      {maybe(() => attribute.name) ? (
                        attribute.name
                      ) : (
                        <Skeleton />
                      )}
                    </TableCell>
                    <TableCell className={classes.colSlug} data-tc="slug">
                      {maybe(() => attribute.slug) ? (
                        attribute.slug
                      ) : (
                        <Skeleton />
                      )}
                    </TableCell>
                    <TableCell className={classes.iconCell}>
                      <IconButton
                        onClick={stopPropagation(() =>
                          onAttributeUnassign(attribute.id)
                        )}
                      >
                        <DeleteIcon color="primary" />
                      </IconButton>
                    </TableCell>
                  </SortableTableRow>
                );
              },
              () => (
                <TableRow>
                  <TableCell colSpan={numberOfColumns}>
                    <FormattedMessage defaultMessage="No attributes found" />
                  </TableCell>
                </TableRow>
              )
            )}
          </SortableTableBody>
        </Table>
      </Card>
    );
  }
);
ProductTypeAttributes.displayName = "ProductTypeAttributes";
export default ProductTypeAttributes;
