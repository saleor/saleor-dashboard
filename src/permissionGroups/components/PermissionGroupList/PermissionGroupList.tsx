// @ts-strict-ignore
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import Skeleton from "@dashboard/components/Skeleton";
import { TableButtonWrapper } from "@dashboard/components/TableButtonWrapper/TableButtonWrapper";
import TableCellHeader from "@dashboard/components/TableCellHeader";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import TableRowLink from "@dashboard/components/TableRowLink";
import { PermissionGroupFragment } from "@dashboard/graphql";
import { maybe, renderCollection, stopPropagation } from "@dashboard/misc";
import {
  permissionGroupDetailsUrl,
  PermissionGroupListUrlSortField,
} from "@dashboard/permissionGroups/urls";
import { ListProps, SortPage } from "@dashboard/types";
import { getArrowDirection } from "@dashboard/utils/sort";
import {
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
} from "@material-ui/core";
import { DeleteIcon, IconButton, makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    [theme.breakpoints.up("lg")]: {
      colActions: {
        width: 180,
      },
      colMembers: {
        width: 180,
      },
      colName: {
        width: "auto",
      },
    },
    colActions: {
      paddingRight: theme.spacing(),
      textAlign: "right",
    },
    colActionsHeader: {
      textAlign: "right",
    },
    colMembers: {
      textAlign: "right",
    },
    colName: {
      paddingLeft: 0,
    },
    link: {
      cursor: "pointer",
    },
  }),
  { name: "PermissionGroupList" },
);
const numberOfColumns = 3;

interface PermissionGroupListProps
  extends ListProps,
    SortPage<PermissionGroupListUrlSortField> {
  permissionGroups: PermissionGroupFragment[];
  onDelete: (id: string) => void;
}

const PermissionGroupList: React.FC<PermissionGroupListProps> = props => {
  const { disabled, permissionGroups, onDelete, onSort, sort } = props;
  const classes = useStyles(props);

  return (
    <ResponsiveTable>
      <TableHead>
        <TableRowLink>
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
              id="szXISP"
              defaultMessage="Permission Group Name"
              description="permission group name"
            />
          </TableCellHeader>
          <TableCellHeader className={classes.colMembers} textAlign="right">
            <FormattedMessage id="+a+2ug" defaultMessage="Members" />
          </TableCellHeader>
          <TableCell className={classes.colActionsHeader}>
            <FormattedMessage id="wL7VAE" defaultMessage="Actions" />
          </TableCell>
        </TableRowLink>
      </TableHead>
      <TableFooter>
        <TableRowLink>
          <TablePaginationWithContext
            colSpan={numberOfColumns}
            disabled={disabled}
          />
        </TableRowLink>
      </TableFooter>
      <TableBody>
        {renderCollection(
          permissionGroups,
          permissionGroup => (
            <TableRowLink
              className={!!permissionGroup ? classes.link : undefined}
              hover={!!permissionGroup}
              key={permissionGroup ? permissionGroup.id : "skeleton"}
              href={
                permissionGroup && permissionGroupDetailsUrl(permissionGroup.id)
              }
              data-test-id={"id-" + maybe(() => permissionGroup.id)}
            >
              <TableCell className={classes.colName}>
                {permissionGroup ? (
                  <span data-test-id="name">{permissionGroup.name}</span>
                ) : (
                  <Skeleton />
                )}
              </TableCell>
              <TableCell className={classes.colMembers}>
                {permissionGroup ? (
                  <span data-test-id="members">
                    {permissionGroup.users.length}
                  </span>
                ) : (
                  <Skeleton />
                )}
              </TableCell>
              <TableCell className={classes.colActions}>
                {permissionGroup ? (
                  <>
                    {permissionGroup.userCanManage && (
                      <TableButtonWrapper>
                        <IconButton
                          variant="secondary"
                          data-test-id="delete-icon"
                          color="primary"
                          onClick={stopPropagation(() =>
                            onDelete(permissionGroup.id),
                          )}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableButtonWrapper>
                    )}
                  </>
                ) : (
                  <Skeleton />
                )}
              </TableCell>
            </TableRowLink>
          ),
          () => (
            <TableRowLink>
              <TableCell colSpan={numberOfColumns}>
                <FormattedMessage
                  id="CXn88q"
                  defaultMessage="No permission groups found"
                />
              </TableCell>
            </TableRowLink>
          ),
        )}
      </TableBody>
    </ResponsiveTable>
  );
};
PermissionGroupList.displayName = "PermissionGroupList";
export default PermissionGroupList;
