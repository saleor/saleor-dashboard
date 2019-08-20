import { Theme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TableRow from "@material-ui/core/TableRow";
import makeStyles from "@material-ui/styles/makeStyles";
import React from "react";
import { FormattedMessage } from "react-intl";

import Checkbox from "@saleor/components/Checkbox";
import Skeleton from "@saleor/components/Skeleton";
import TableHead from "@saleor/components/TableHead";
import TablePagination from "@saleor/components/TablePagination";
import { renderCollection } from "@saleor/misc";
import { ListActions, ListProps } from "@saleor/types";
import { translateBoolean } from "@saleor/utils/i18n";
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
  colSlug: {},
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
          <FormattedMessage
            defaultMessage="Attribute Code"
            id="attributeListSlugColumnHeader"
          />
        </TableCell>
        <TableCell className={classes.colName}>
          <FormattedMessage
            defaultMessage="Default Label"
            description="attribute's label'"
            id="attributeListNameColumnHeader"
          />
        </TableCell>
        <TableCell className={classes.colVisible}>
          <FormattedMessage
            defaultMessage="Visible"
            description="attribute is visible"
            id="attributeListVisibilityColumnHeader"
          />
        </TableCell>
        <TableCell className={classes.colSearchable}>
          <FormattedMessage
            defaultMessage="Searchable"
            description="attribute can be searched in dashboard"
            id="attributeListSearchableColumnHeader"
          />
        </TableCell>
        <TableCell className={classes.colFaceted}>
          <FormattedMessage
            defaultMessage="Use in faceted search"
            description="attribute can be searched in storefront"
            id="attributeListFacetedColumnHeader"
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
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={isSelected}
                    disabled={disabled}
                    disableClickPropagation
                    onChange={() => toggle(attribute.id)}
                  />
                </TableCell>
                <TableCell className={classes.colSlug}>
                  {attribute ? attribute.slug : <Skeleton />}
                </TableCell>
                <TableCell className={classes.colName}>
                  {attribute ? attribute.name : <Skeleton />}
                </TableCell>
                <TableCell className={classes.colVisible}>
                  {attribute ? (
                    translateBoolean(attribute.visibleInStorefront)
                  ) : (
                    <Skeleton />
                  )}
                </TableCell>
                <TableCell className={classes.colSearchable}>
                  {attribute ? (
                    translateBoolean(attribute.filterableInDashboard)
                  ) : (
                    <Skeleton />
                  )}
                </TableCell>
                <TableCell className={classes.colFaceted}>
                  {attribute ? (
                    translateBoolean(attribute.filterableInStorefront)
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
                <FormattedMessage
                  defaultMessage="No attributes found"
                  id="AttributeListNoAttributes"
                />
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
