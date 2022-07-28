import { TableBody, TableCell, TableFooter, TableRow } from "@material-ui/core";
import {
  AttributeListUrlSortField,
  attributeUrl,
} from "@saleor/attributes/urls";
import Checkbox from "@saleor/components/Checkbox";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import TableCellHeader from "@saleor/components/TableCellHeader";
import TableHead from "@saleor/components/TableHead";
import { TablePaginationWithContext } from "@saleor/components/TablePagination";
import TableRowLink from "@saleor/components/TableRowLink";
import { AttributeFragment } from "@saleor/graphql";
import { translateBoolean } from "@saleor/intl";
import { makeStyles } from "@saleor/macaw-ui";
import { maybe, renderCollection } from "@saleor/misc";
import { ListActions, ListProps, SortPage } from "@saleor/types";
import { getArrowDirection } from "@saleor/utils/sort";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface AttributeListProps
  extends ListProps,
    ListActions,
    SortPage<AttributeListUrlSortField> {
  attributes: AttributeFragment[];
}

const useStyles = makeStyles(
  theme => ({
    [theme.breakpoints.up("lg")]: {
      colFaceted: {
        width: 180,
      },
      colName: {
        width: "auto",
      },
      colSearchable: {
        width: 180,
      },
      colSlug: {
        width: 200,
      },
      colVisible: {
        width: 180,
      },
    },
    colFaceted: {
      textAlign: "center",
    },
    colName: {},
    colSearchable: {
      textAlign: "center",
    },
    colSlug: {
      paddingLeft: 0,
    },
    colVisible: {
      textAlign: "center",
    },
    link: {
      cursor: "pointer",
    },
  }),
  { name: "AttributeList" },
);

const numberOfColumns = 6;

const AttributeList: React.FC<AttributeListProps> = ({
  attributes,
  disabled,
  isChecked,
  selected,
  sort,
  toggle,
  toggleAll,
  toolbar,
  onSort,
}) => {
  const classes = useStyles({});
  const intl = useIntl();

  return (
    <ResponsiveTable>
      <TableHead
        colSpan={numberOfColumns}
        selected={selected}
        disabled={disabled}
        items={attributes}
        toggleAll={toggleAll}
        toolbar={toolbar}
      >
        <TableCellHeader
          className={classes.colSlug}
          direction={
            sort.sort === AttributeListUrlSortField.slug
              ? getArrowDirection(sort.asc)
              : undefined
          }
          arrowPosition="right"
          onClick={() => onSort(AttributeListUrlSortField.slug)}
        >
          <FormattedMessage id="oJkeS6" defaultMessage="Attribute Code" />
        </TableCellHeader>
        <TableCellHeader
          className={classes.colName}
          direction={
            sort.sort === AttributeListUrlSortField.name
              ? getArrowDirection(sort.asc)
              : undefined
          }
          onClick={() => onSort(AttributeListUrlSortField.name)}
        >
          <FormattedMessage
            id="HjUoHK"
            defaultMessage="Default Label"
            description="attribute's label'"
          />
        </TableCellHeader>
        <TableCellHeader
          className={classes.colVisible}
          direction={
            sort.sort === AttributeListUrlSortField.visible
              ? getArrowDirection(sort.asc)
              : undefined
          }
          textAlign="center"
          onClick={() => onSort(AttributeListUrlSortField.visible)}
        >
          <FormattedMessage
            id="k6WDZl"
            defaultMessage="Visible"
            description="attribute is visible"
          />
        </TableCellHeader>
        <TableCellHeader
          className={classes.colSearchable}
          direction={
            sort.sort === AttributeListUrlSortField.searchable
              ? getArrowDirection(sort.asc)
              : undefined
          }
          textAlign="center"
          onClick={() => onSort(AttributeListUrlSortField.searchable)}
        >
          <FormattedMessage
            id="yKuba7"
            defaultMessage="Searchable"
            description="attribute can be searched in dashboard"
          />
        </TableCellHeader>
        <TableCellHeader
          className={classes.colFaceted}
          direction={
            sort.sort === AttributeListUrlSortField.useInFacetedSearch
              ? getArrowDirection(sort.asc)
              : undefined
          }
          textAlign="center"
          onClick={() => onSort(AttributeListUrlSortField.useInFacetedSearch)}
        >
          <FormattedMessage
            defaultMessage="Use as filter"
            id="Y3pCRX"
            description="attribute can be searched in storefront"
          />
        </TableCellHeader>
      </TableHead>
      <TableFooter>
        <TableRow>
          <TablePaginationWithContext colSpan={numberOfColumns} />
        </TableRow>
      </TableFooter>
      <TableBody>
        {renderCollection(
          attributes,
          attribute => {
            const isSelected = attribute ? isChecked(attribute.id) : false;

            return (
              <TableRowLink
                selected={isSelected}
                hover={!!attribute}
                key={attribute ? attribute.id : "skeleton"}
                href={attribute && attributeUrl(attribute.id)}
                className={classes.link}
                data-test-id={"id-" + maybe(() => attribute.id)}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={isSelected}
                    disabled={disabled}
                    disableClickPropagation
                    onChange={() => toggle(attribute.id)}
                  />
                </TableCell>
                <TableCell className={classes.colSlug} data-test-id="slug">
                  {attribute ? attribute.slug : <Skeleton />}
                </TableCell>
                <TableCell className={classes.colName} data-test-id="name">
                  {attribute ? attribute.name : <Skeleton />}
                </TableCell>
                <TableCell
                  className={classes.colVisible}
                  data-test-id="visible"
                  data-test-visible={maybe(() => attribute.visibleInStorefront)}
                >
                  {attribute ? (
                    translateBoolean(attribute.visibleInStorefront, intl)
                  ) : (
                    <Skeleton />
                  )}
                </TableCell>
                <TableCell
                  className={classes.colSearchable}
                  data-test-id="searchable"
                  data-test-searchable={maybe(
                    () => attribute.filterableInDashboard,
                  )}
                >
                  {attribute ? (
                    translateBoolean(attribute.filterableInDashboard, intl)
                  ) : (
                    <Skeleton />
                  )}
                </TableCell>
                <TableCell
                  className={classes.colFaceted}
                  data-test-id="use-in-faceted-search"
                  data-test-use-in-faceted-search={maybe(
                    () => attribute.filterableInStorefront,
                  )}
                >
                  {attribute ? (
                    translateBoolean(attribute.filterableInStorefront, intl)
                  ) : (
                    <Skeleton />
                  )}
                </TableCell>
              </TableRowLink>
            );
          },
          () => (
            <TableRow>
              <TableCell colSpan={numberOfColumns}>
                <FormattedMessage
                  id="ztQgD8"
                  defaultMessage="No attributes found"
                />
              </TableCell>
            </TableRow>
          ),
        )}
      </TableBody>
    </ResponsiveTable>
  );
};
AttributeList.displayName = "AttributeList";
export default AttributeList;
