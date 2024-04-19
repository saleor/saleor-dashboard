// @ts-strict-ignore
import { attributeUrl } from "@dashboard/attributes/urls";
import { Button } from "@dashboard/components/Button";
import CardTitle from "@dashboard/components/CardTitle";
import Checkbox from "@dashboard/components/Checkbox";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import Skeleton from "@dashboard/components/Skeleton";
import { SortableTableBody, SortableTableRow } from "@dashboard/components/SortableTable";
import { TableButtonWrapper } from "@dashboard/components/TableButtonWrapper/TableButtonWrapper";
import TableHead from "@dashboard/components/TableHead";
import TableRowLink from "@dashboard/components/TableRowLink";
import { AttributeFragment, ProductAttributeType } from "@dashboard/graphql";
import { maybe, renderCollection } from "@dashboard/misc";
import { ListActions, ReorderAction } from "@dashboard/types";
import { Card, CardContent, TableCell } from "@material-ui/core";
import { DeleteIcon, IconButton, makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

const useStyles = makeStyles(
  {
    colAction: {
      "&:last-child": {
        paddingRight: 0,
      },
      width: 84,
    },
    colGrab: {
      width: 60,
    },
    colName: {},
    colSlug: {
      width: 300,
    },
    link: {
      cursor: "pointer",
    },
    textLeft: {
      textAlign: "left",
    },
  },
  { name: "ProductTypeAttributes" },
);

interface ProductTypeAttributesProps extends ListActions {
  attributes: AttributeFragment[];
  disabled: boolean;
  type: string;
  testId?: string;
  onAttributeAssign: (type: ProductAttributeType) => void;
  onAttributeReorder: ReorderAction;
  onAttributeUnassign: (id: string) => void;
}

const numberOfColumns = 5;
const ProductTypeAttributes: React.FC<ProductTypeAttributesProps> = props => {
  const {
    attributes,

    disabled,
    isChecked,
    selected,
    toggle,
    toggleAll,
    toolbar,
    type,
    testId,
    onAttributeAssign,
    onAttributeReorder,
    onAttributeUnassign,
  } = props;
  const classes = useStyles(props);
  const intl = useIntl();

  return (
    <Card data-test-id="product-attributes">
      <CardTitle
        title={intl.formatMessage({
          id: "9scTQ0",
          defaultMessage: "Product Attributes",
          description: "section header",
        })}
        toolbar={
          <Button
            disabled={disabled}
            data-test-id={testId}
            variant="tertiary"
            onClick={() => onAttributeAssign(ProductAttributeType[type])}
          >
            <FormattedMessage id="uxPpRx" defaultMessage="Assign attribute" description="button" />
          </Button>
        }
      />
      <CardContent>
        <ResponsiveTable>
          <colgroup>
            <col className={classes.colGrab} />
            <col />
            <col className={classes.colName} />
            <col className={classes.colSlug} />
            <col className={classes.colAction} />
          </colgroup>
          {attributes?.length > 0 && (
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
                <FormattedMessage id="kTr2o8" defaultMessage="Attribute name" />
              </TableCell>
              <TableCell className={classes.colName}>
                <FormattedMessage
                  id="nf3XSt"
                  defaultMessage="Slug"
                  description="attribute internal name"
                />
              </TableCell>
              <TableCell />
            </TableHead>
          )}
          <SortableTableBody onSortEnd={onAttributeReorder}>
            {renderCollection(
              attributes,
              (attribute, attributeIndex) => {
                const isSelected = attribute ? isChecked(attribute.id) : false;

                return (
                  <SortableTableRow
                    selected={isSelected}
                    className={attribute ? classes.link : undefined}
                    hover={!!attribute}
                    href={attribute ? attributeUrl(attribute.id) : undefined}
                    key={maybe(() => attribute.id)}
                    index={attributeIndex || 0}
                    data-test-id={"id" + maybe(() => attribute.id)}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        disabled={disabled}
                        disableClickPropagation
                        onChange={() => toggle(attribute.id)}
                      />
                    </TableCell>
                    <TableCell className={classes.colName} data-test-id="name">
                      {maybe(() => attribute.name) ? attribute.name : <Skeleton />}
                    </TableCell>
                    <TableCell className={classes.colSlug} data-test-id="slug">
                      {maybe(() => attribute.slug) ? attribute.slug : <Skeleton />}
                    </TableCell>
                    <TableCell className={classes.colAction}>
                      <TableButtonWrapper>
                        <IconButton
                          data-test-id="delete-icon"
                          disabled={disabled}
                          variant="secondary"
                          onClick={() => onAttributeUnassign(attribute.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableButtonWrapper>
                    </TableCell>
                  </SortableTableRow>
                );
              },
              () => (
                <TableRowLink>
                  <TableCell colSpan={numberOfColumns}>
                    <FormattedMessage id="ztQgD8" defaultMessage="No attributes found" />
                  </TableCell>
                </TableRowLink>
              ),
            )}
          </SortableTableBody>
        </ResponsiveTable>
      </CardContent>
    </Card>
  );
};
ProductTypeAttributes.displayName = "ProductTypeAttributes";
export default ProductTypeAttributes;
