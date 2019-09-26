import { Theme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TableRow from "@material-ui/core/TableRow";
import makeStyles from "@material-ui/styles/makeStyles";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import Checkbox from "@saleor/components/Checkbox";
import Skeleton from "@saleor/components/Skeleton";
import TableHead from "@saleor/components/TableHead";
import TablePagination from "@saleor/components/TablePagination";
import { translateBoolean } from "@saleor/intl";
import { maybe, renderCollection } from "@saleor/misc";
import { ListActions, ListProps } from "@saleor/types";
import { AttributeList_attributes_edges_node } from "../../types/AttributeList";

export interface AttributeListProps extends ListProps, ListActions {
  attributes: AttributeList_attributes_edges_node[];
}

const useStyles = makeStyles((theme: Theme) => ({
  [theme.breakpoints.up("lg")]: {
    colFaceted: {
      width: 150
    },
    colName: {
      width: "auto"
    },
    colSearchable: {
      width: 150
    },
    colSlug: {
      width: 200
    },
    colVisible: {
      width: 150
    }
  },
  colFaceted: {
    textAlign: "center"
  },
  colName: {},
  colSearchable: {
    textAlign: "center"
  },
  colSlug: {
    paddingLeft: 0
  },
  colVisible: {
    textAlign: "center"
  },
  link: {
    cursor: "pointer"
  }
}));

const numberOfColumns = 6;

const AttributeList: React.StatelessComponent<AttributeListProps> = ({
  attributes,
  disabled,
  isChecked,
  onNextPage,
  onPreviousPage,
  onRowClick,
  pageInfo,
  selected,
  toggle,
  toggleAll,
  toolbar
}) => {
  const classes = useStyles({});
  const intl = useIntl();

  return (
    <Table>
      <TableHead
        colSpan={numberOfColumns}
        selected={selected}
        disabled={disabled}
        items={attributes}
        toggleAll={toggleAll}
        toolbar={toolbar}
      >
        <TableCell className={classes.colSlug}>
          <FormattedMessage defaultMessage="Attribute Code" />
        </TableCell>
        <TableCell className={classes.colName}>
          <FormattedMessage
            defaultMessage="Default Label"
            description="attribute's label'"
          />
        </TableCell>
        <TableCell className={classes.colVisible}>
          <FormattedMessage
            defaultMessage="Visible"
            description="attribute is visible"
          />
        </TableCell>
        <TableCell className={classes.colSearchable}>
          <FormattedMessage
            defaultMessage="Searchable"
            description="attribute can be searched in dashboard"
          />
        </TableCell>
        <TableCell className={classes.colFaceted}>
          <FormattedMessage
            defaultMessage="Use in faceted search"
            description="attribute can be searched in storefront"
          />
        </TableCell>
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
          attributes,
          attribute => {
            const isSelected = attribute ? isChecked(attribute.id) : false;

            return (
              <TableRow
                selected={isSelected}
                hover={!!attribute}
                key={attribute ? attribute.id : "skeleton"}
                onClick={attribute && onRowClick(attribute.id)}
                className={classes.link}
                data-tc="id"
                data-tc-id={maybe(() => attribute.id)}
                data-tc-values={JSON.stringify(
                  maybe(() => attribute.values, [])
                )}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={isSelected}
                    disabled={disabled}
                    disableClickPropagation
                    onChange={() => toggle(attribute.id)}
                  />
                </TableCell>
                <TableCell className={classes.colSlug} data-tc="slug">
                  {attribute ? attribute.slug : <Skeleton />}
                </TableCell>
                <TableCell className={classes.colName} data-tc="name">
                  {attribute ? attribute.name : <Skeleton />}
                </TableCell>
                <TableCell
                  className={classes.colVisible}
                  data-tc="visible"
                  data-tc-visible={maybe(() => attribute.visibleInStorefront)}
                >
                  {attribute ? (
                    translateBoolean(attribute.visibleInStorefront, intl)
                  ) : (
                    <Skeleton />
                  )}
                </TableCell>
                <TableCell
                  className={classes.colSearchable}
                  data-tc="searchable"
                  data-tc-searchable={maybe(
                    () => attribute.filterableInDashboard
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
                  data-tc="use-in-faceted-search"
                  data-tc-use-in-faceted-search={maybe(
                    () => attribute.filterableInStorefront
                  )}
                >
                  {attribute ? (
                    translateBoolean(attribute.filterableInStorefront, intl)
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
                <FormattedMessage defaultMessage="No attributes found" />
              </TableCell>
            </TableRow>
          )
        )}
      </TableBody>
    </Table>
  );
};
AttributeList.displayName = "AttributeList";
export default AttributeList;
