import { makeStyles } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TableRow from "@material-ui/core/TableRow";
import Checkbox from "@saleor/components/Checkbox";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import TableCellHeader from "@saleor/components/TableCellHeader";
import TableHead from "@saleor/components/TableHead";
import TablePagination from "@saleor/components/TablePagination";
import { PageTypeList_pageTypes_edges_node } from "@saleor/pageTypes/types/PageTypeList";
import { PageTypeListUrlSortField } from "@saleor/pageTypes/urls";
import { getArrowDirection } from "@saleor/utils/sort";
import React from "react";
import { FormattedMessage } from "react-intl";

import { renderCollection } from "../../../misc";
import { ListActions, ListProps, SortPage } from "../../../types";

const useStyles = makeStyles(
  {
    colName: {
      paddingLeft: 0
    },
    link: {
      cursor: "pointer"
    }
  },
  { name: "PageTypeList" }
);

interface PageTypeListProps
  extends ListProps,
    ListActions,
    SortPage<PageTypeListUrlSortField> {
  pageTypes: PageTypeList_pageTypes_edges_node[];
}

const numberOfColumns = 2;

const PageTypeList: React.FC<PageTypeListProps> = props => {
  const {
    disabled,
    pageTypes,
    pageInfo,
    onNextPage,
    onPreviousPage,
    onRowClick,
    onSort,
    isChecked,
    selected,
    sort,
    toggle,
    toggleAll,
    toolbar
  } = props;
  const classes = useStyles(props);

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
            sort.sort === PageTypeListUrlSortField.name
              ? getArrowDirection(sort.asc)
              : undefined
          }
          arrowPosition="right"
          onClick={() => onSort(PageTypeListUrlSortField.name)}
          className={classes.colName}
        >
          <FormattedMessage
            defaultMessage="Content Type Name"
            description="page type name"
          />
        </TableCellHeader>
      </TableHead>
      <TableFooter>
        <TableRow>
          <TablePagination
            colSpan={numberOfColumns}
            hasNextPage={pageInfo && !disabled ? pageInfo.hasNextPage : false}
            onNextPage={onNextPage}
            hasPreviousPage={
              pageInfo && !disabled ? pageInfo.hasPreviousPage : false
            }
            onPreviousPage={onPreviousPage}
          />
        </TableRow>
      </TableFooter>
      <TableBody>
        {renderCollection(
          pageTypes,
          pageType => {
            const isSelected = pageType ? isChecked(pageType.id) : false;
            return (
              <TableRow
                className={!!pageType ? classes.link : undefined}
                hover={!!pageType}
                key={pageType ? pageType.id : "skeleton"}
                onClick={pageType ? onRowClick(pageType.id) : undefined}
                selected={isSelected}
                data-test="id"
                data-test-id={pageType?.id}
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
                  {pageType ? (
                    <span data-test="name">{pageType.name}</span>
                  ) : (
                    <Skeleton />
                  )}
                </TableCell>
              </TableRow>
            );
          },
          () => (
            <TableRow>
              <TableCell colSpan={numberOfColumns}>
                <FormattedMessage defaultMessage="No page types found" />
              </TableCell>
            </TableRow>
          )
        )}
      </TableBody>
    </ResponsiveTable>
  );
};
PageTypeList.displayName = "PageTypeList";
export default PageTypeList;
