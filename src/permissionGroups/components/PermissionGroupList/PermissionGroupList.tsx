import { makeStyles } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TableRow from "@material-ui/core/TableRow";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";

import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import Checkbox from "@saleor/components/Checkbox";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import TableHead from "@saleor/components/TableHead";
import TablePagination from "@saleor/components/TablePagination";
import { getArrowDirection } from "@saleor/utils/sort";
import TableCellHeader from "@saleor/components/TableCellHeader";
import { maybe, renderCollection, stopPropagation } from "../../../misc";
import { ListActions, ListProps, SortPage } from "../../../types";
import { PermissionGroupList_permissionGroups_edges_node } from "../../types/PermissionGroupList";

import { PermissionGroupListUrlSortField } from "../../urls";

const useStyles = makeStyles(
  theme => ({
    [theme.breakpoints.up("lg")]: {
      colActions: {
        width: 180
      },
      colMembers: {
        width: 180
      },
      colName: {
        width: "auto"
      }
    },
    colActions: {
      textAlign: "right"
    },
    colMembers: {
      textAlign: "right"
    },
    colName: {
      paddingLeft: 0
    },
    link: {
      cursor: "pointer"
    }
  }),
  { name: "PermissionGroupList" }
);

interface PermissionGroupListProps
  extends ListProps,
    ListActions,
    SortPage<PermissionGroupListUrlSortField> {
  permissionGroups: PermissionGroupList_permissionGroups_edges_node[];
  onDelete: (id: string) => void;
}

const numberOfColumns = 4;

const PermissionGroupList: React.FC<PermissionGroupListProps> = props => {
  const {
    disabled,
    permissionGroups,
    pageInfo,
    onDelete,
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
        items={permissionGroups}
        toggleAll={toggleAll}
        toolbar={toolbar}
      >
        <TableCellHeader
          direction={
            sort.sort === PermissionGroupListUrlSortField.name
              ? getArrowDirection(sort.asc)
              : undefined
          }
          arrowPosition="right"
          onClick={() => onSort(PermissionGroupListUrlSortField.name)}
          className={classes.colName}
        >
          <FormattedMessage
            defaultMessage="Permission Group Name"
            description="permission group name"
          />
        </TableCellHeader>
        <TableCellHeader className={classes.colMembers} textAlign="right">
          <FormattedMessage defaultMessage="Members" description="TODO" />
        </TableCellHeader>
        <TableCell className={classes.colActions}>
          <FormattedMessage defaultMessage="Actions" description="TODO" />
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
          permissionGroups,
          permissionGroup => {
            const isSelected = permissionGroup
              ? isChecked(permissionGroup.id)
              : false;
            return (
              <TableRow
                className={!!permissionGroup ? classes.link : undefined}
                hover={!!permissionGroup}
                key={permissionGroup ? permissionGroup.id : "skeleton"}
                onClick={
                  permissionGroup ? onRowClick(permissionGroup.id) : undefined
                }
                selected={isSelected}
                data-tc="id"
                data-tc-id={maybe(() => permissionGroup.id)}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={isSelected}
                    disabled={disabled}
                    disableClickPropagation
                    onChange={() => toggle(permissionGroup.id)}
                  />
                </TableCell>
                <TableCell className={classes.colName}>
                  {permissionGroup ? (
                    <span data-tc="name">{permissionGroup.name}</span>
                  ) : (
                    <Skeleton />
                  )}
                </TableCell>
                <TableCell className={classes.colMembers}>
                  {permissionGroup ? (
                    <span data-tc="members">
                      {permissionGroup.users.length}
                    </span>
                  ) : (
                    <Skeleton />
                  )}
                </TableCell>
                <TableCell className={classes.colAction}>
                  {permissionGroup ? (
                    <>
                      <IconButton
                        color="primary"
                        onClick={stopPropagation(() =>
                          onDelete(permissionGroup.id)
                        )}
                      >
                        <DeleteIcon />
                      </IconButton>
                      <IconButton color="primary">
                        <EditIcon />
                      </IconButton>
                    </>
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
                <FormattedMessage defaultMessage="No permission groups found" />
              </TableCell>
            </TableRow>
          )
        )}
      </TableBody>
    </ResponsiveTable>
  );
};
PermissionGroupList.displayName = "PermissionGroupList";
export default PermissionGroupList;
