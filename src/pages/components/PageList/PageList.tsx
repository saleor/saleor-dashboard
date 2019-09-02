import Card from "@material-ui/core/Card";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TableRow from "@material-ui/core/TableRow";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import Checkbox from "@saleor/components/Checkbox";
import Skeleton from "@saleor/components/Skeleton";
import StatusLabel from "@saleor/components/StatusLabel";
import TableHead from "@saleor/components/TableHead";
import TablePagination from "@saleor/components/TablePagination";
import { maybe, renderCollection } from "@saleor/misc";
import { ListActions, ListProps } from "@saleor/types";
import { PageList_pages_edges_node } from "../../types/PageList";

export interface PageListProps extends ListProps, ListActions {
  pages: PageList_pages_edges_node[];
}

const styles = (theme: Theme) =>
  createStyles({
    [theme.breakpoints.up("lg")]: {
      colSlug: {
        width: 250
      },
      colTitle: {},
      colVisibility: {
        width: 200
      }
    },
    colSlug: {},
    colTitle: {
      paddingLeft: 0
    },
    colVisibility: {},
    link: {
      cursor: "pointer"
    }
  });

const numberOfColumns = 4;

const PageList = withStyles(styles, { name: "PageList" })(
  ({
    classes,
    settings,
    pages,
    disabled,
    onNextPage,
    pageInfo,
    onRowClick,
    onUpdateListSettings,
    onPreviousPage,
    isChecked,
    selected,
    toggle,
    toggleAll,
    toolbar
  }: PageListProps & WithStyles<typeof styles>) => {
    const intl = useIntl();

    return (
      <Card>
        <Table>
          <TableHead
            colSpan={numberOfColumns}
            selected={selected}
            disabled={disabled}
            items={pages}
            toggleAll={toggleAll}
            toolbar={toolbar}
          >
            <TableCell className={classes.colTitle} padding="dense">
              <FormattedMessage
                defaultMessage="Title"
                description="dialog header"
              />
            </TableCell>
            <TableCell className={classes.colSlug} padding="dense">
              <FormattedMessage
                defaultMessage="Slug"
                description="page internal name"
              />
            </TableCell>
            <TableCell className={classes.colVisibility} padding="dense">
              <FormattedMessage
                defaultMessage="Visibility"
                description="page status"
              />
            </TableCell>
          </TableHead>
          <TableFooter>
            <TableRow>
              <TablePagination
                colSpan={numberOfColumns}
                settings={settings}
                hasNextPage={
                  pageInfo && !disabled ? pageInfo.hasNextPage : false
                }
                onNextPage={onNextPage}
                onUpdateListSettings={onUpdateListSettings}
                hasPreviousPage={
                  pageInfo && !disabled ? pageInfo.hasPreviousPage : false
                }
                onPreviousPage={onPreviousPage}
              />
            </TableRow>
          </TableFooter>
          <TableBody>
            {renderCollection(
              pages,
              page => {
                const isSelected = page ? isChecked(page.id) : false;

                return (
                  <TableRow
                    hover={!!page}
                    className={!!page ? classes.link : undefined}
                    onClick={page ? onRowClick(page.id) : undefined}
                    key={page ? page.id : "skeleton"}
                    selected={isSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        disabled={disabled}
                        disableClickPropagation
                        onChange={() => toggle(page.id)}
                      />
                    </TableCell>
                    <TableCell className={classes.colTitle}>
                      {maybe<React.ReactNode>(() => page.title, <Skeleton />)}
                    </TableCell>
                    <TableCell className={classes.colSlug}>
                      {maybe<React.ReactNode>(() => page.slug, <Skeleton />)}
                    </TableCell>
                    <TableCell className={classes.colVisibility}>
                      {maybe<React.ReactNode>(
                        () => (
                          <StatusLabel
                            label={
                              page.isPublished
                                ? intl.formatMessage({
                                    defaultMessage: "Published",
                                    description: "page status"
                                  })
                                : intl.formatMessage({
                                    defaultMessage: "Not Published",
                                    description: "page status"
                                  })
                            }
                            status={page.isPublished ? "success" : "error"}
                          />
                        ),
                        <Skeleton />
                      )}
                    </TableCell>
                  </TableRow>
                );
              },
              () => (
                <TableRow>
                  <TableCell colSpan={numberOfColumns}>
                    <FormattedMessage defaultMessage="No pages found" />
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </Card>
    );
  }
);
PageList.displayName = "PageList";
export default PageList;
