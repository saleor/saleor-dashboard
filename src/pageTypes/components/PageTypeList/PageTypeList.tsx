// @ts-strict-ignore
import Checkbox from "@dashboard/components/Checkbox";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import TableCellHeader from "@dashboard/components/TableCellHeader";
import TableHead from "@dashboard/components/TableHead";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import TableRowLink from "@dashboard/components/TableRowLink";
import { PageTypeFragment } from "@dashboard/graphql";
import { PageTypeListUrlSortField, pageTypeUrl } from "@dashboard/pageTypes/urls";
import { getArrowDirection } from "@dashboard/utils/sort";
import { TableBody, TableCell, TableFooter } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import { Skeleton } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";
import { useLocation } from "react-router";

import { renderCollection } from "../../../misc";
import { ListActions, ListProps, SortPage } from "../../../types";

const useStyles = makeStyles(
  {
    colName: {
      paddingLeft: 0,
    },
    link: {
      cursor: "pointer",
    },
  },
  { name: "PageTypeList" },
);

interface PageTypeListProps extends ListProps, ListActions, SortPage<PageTypeListUrlSortField> {
  pageTypes: PageTypeFragment[];
}

const PageTypeList: React.FC<PageTypeListProps> = props => {
  const { disabled, pageTypes, onSort, isChecked, selected, sort, toggle, toggleAll, toolbar } =
    props;
  const location = useLocation();
  const classes = useStyles(props);
  const numberOfColumns = pageTypes?.length === 0 ? 1 : 2;

  return (
    <ResponsiveTable>
      <TableHead
        colSpan={numberOfColumns}
        selected={selected}
        disabled={disabled}
        items={pageTypes}
        toggleAll={toggleAll}
        toolbar={toolbar}
      >
        <TableCellHeader
          direction={
            sort.sort === PageTypeListUrlSortField.name ? getArrowDirection(sort.asc) : undefined
          }
          arrowPosition="right"
          onClick={() => onSort(PageTypeListUrlSortField.name)}
          className={classes.colName}
        >
          <FormattedMessage
            id="BQ2NVl"
            defaultMessage="Content Type Name"
            description="page type name"
          />
        </TableCellHeader>
      </TableHead>
      <TableFooter>
        <TableRowLink>
          <TablePaginationWithContext colSpan={numberOfColumns} disabled={disabled} />
        </TableRowLink>
      </TableFooter>
      <TableBody data-test-id="page-types-list">
        {renderCollection(
          pageTypes,
          pageType => {
            const isSelected = pageType ? isChecked(pageType.id) : false;

            return (
              <TableRowLink
                className={pageType ? classes.link : undefined}
                hover={!!pageType}
                key={pageType ? pageType.id : "skeleton"}
                href={
                  pageType
                    ? {
                        pathname: pageTypeUrl(pageType.id),
                        state: { prevLocation: location },
                      }
                    : undefined
                }
                selected={isSelected}
                data-test-id={"id-" + pageType?.id}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={isSelected}
                    disabled={disabled}
                    disableClickPropagation
                    onChange={() => toggle(pageType.id)}
                  />
                </TableCell>
                <TableCell className={classes.colName}>
                  {pageType ? <span data-test-id="name">{pageType.name}</span> : <Skeleton />}
                </TableCell>
              </TableRowLink>
            );
          },
          () => (
            <TableRowLink>
              <TableCell colSpan={numberOfColumns}>
                <FormattedMessage id="6fORLY" defaultMessage="No page types found" />
              </TableCell>
            </TableRowLink>
          ),
        )}
      </TableBody>
    </ResponsiveTable>
  );
};

PageTypeList.displayName = "PageTypeList";
export default PageTypeList;
