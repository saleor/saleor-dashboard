import Card from "@material-ui/core/Card";
import { makeStyles } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@saleor/components/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import classNames from "classnames";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import DeleteIcon from "@material-ui/icons/Delete";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import {
  getUserInitials,
  getUserName,
  stopPropagation,
  renderCollection
} from "@saleor/misc";
import { ListActions, SortPage } from "@saleor/types";
import TableCellHeader from "@saleor/components/TableCellHeader";
import Checkbox from "@saleor/components/Checkbox";

import { Button, IconButton } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import { PermissionGroupDetails_permissionGroup_users } from "@saleor/permissionGroups/types/PermissionGroupDetails";
import { MembersListUrlSortField } from "@saleor/permissionGroups/urls";
import { getArrowDirection } from "@saleor/utils/sort";
import { sortMembers } from "@saleor/permissionGroups/sort";

const useStyles = makeStyles(
  theme => ({
    [theme.breakpoints.up("lg")]: {
      colActions: {
        width: 120
      },
      colEmail: {
        width: 300
      },
      colName: {
        width: "auto"
      }
    },
    avatar: {
      alignItems: "center",
      borderRadius: "100%",
      display: "grid",
      float: "left",
      height: 47,
      justifyContent: "center",
      marginRight: theme.spacing(1),
      overflow: "hidden",
      width: 47
    },
    avatarDefault: {
      "& p": {
        color: "#fff",
        lineHeight: "47px"
      },
      background: theme.palette.primary.main,
      height: 47,
      textAlign: "center",
      width: 47
    },
    avatarImage: {
      pointerEvents: "none",
      width: "100%"
    },
    colActions: {
      paddingRight: theme.spacing(),
      textAlign: "right"
    },
    helperText: {
      marginBottom: theme.spacing(3),
      marginTop: theme.spacing(3),
      textAlign: "center"
    },
    statusText: {
      color: "#9E9D9D"
    },
    tableRow: {}
  }),
  { name: "PermissionGroup" }
);
const numberOfColumns = 4;

interface PermissionGroupProps
  extends ListActions,
    SortPage<MembersListUrlSortField> {
  users: PermissionGroupDetails_permissionGroup_users[];
  disabled: boolean;
  onUnassign: (ida: string[]) => void;
  onAssign: () => void;
}

const PermissionGroupMemberList: React.FC<PermissionGroupProps> = props => {
  const {
    disabled,
    users,
    onUnassign,
    onAssign,
    onSort,
    toggle,
    toolbar,
    isChecked,
    selected,
    toggleAll,
    sort
  } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  const members = users?.sort(sortMembers(sort?.sort, sort?.asc));

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Group members",
          description: "header"
        })}
        toolbar={
          <Button
            color={disabled ? "secondary" : "primary"}
            onClick={onAssign}
            disabled={disabled}
          >
            <FormattedMessage
              defaultMessage="Assign members"
              description="button"
            />
          </Button>
        }
      />
      {members?.length === 0 ? (
        <div className={classNames(classes.helperText)}>
          <Typography color="textSecondary">
            <FormattedMessage
              defaultMessage="You haven’t assigned any member to this permission group yet."
              description="empty list message"
            />
          </Typography>
          <Typography color="textSecondary">
            <FormattedMessage
              defaultMessage="Please use Assign Members button to do so."
              description="empty list message"
            />
          </Typography>
        </div>
      ) : (
        <ResponsiveTable>
          <TableHead
            colSpan={numberOfColumns}
            selected={selected}
            disabled={disabled}
            items={members}
            toggleAll={toggleAll}
            toolbar={toolbar}
          >
            <TableCellHeader
              className={classes.colName}
              arrowPosition="right"
              onClick={() => onSort(MembersListUrlSortField.name)}
              direction={
                sort?.sort === MembersListUrlSortField.name
                  ? getArrowDirection(sort.asc)
                  : undefined
              }
            >
              <FormattedMessage
                defaultMessage="Name"
                description="staff member full name"
              />
            </TableCellHeader>
            <TableCellHeader
              className={classes.colEmail}
              arrowPosition="right"
              onClick={() => onSort(MembersListUrlSortField.email)}
              direction={
                sort?.sort === MembersListUrlSortField.email
                  ? getArrowDirection(sort.asc)
                  : undefined
              }
            >
              <FormattedMessage defaultMessage="Email Address" />
            </TableCellHeader>
            <TableCellHeader textAlign="right">
              <FormattedMessage defaultMessage="Actions" />
            </TableCellHeader>
          </TableHead>
          <TableBody>
            {renderCollection(
              members,
              user => {
                const isSelected = user ? isChecked(user.id) : false;

                return (
                  <TableRow
                    className={classNames({
                      [classes.tableRow]: !!user
                    })}
                    hover={!!user}
                    selected={isSelected}
                    key={user ? user.id : "skeleton"}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        disabled={disabled}
                        disableClickPropagation
                        onChange={() => toggle(user.id)}
                      />
                    </TableCell>
                    <TableCell className={classes.colName}>
                      <div className={classes.avatar}>
                        {user?.avatar?.url ? (
                          <img
                            className={classes.avatarImage}
                            src={user?.avatar?.url}
                          />
                        ) : (
                          <div className={classes.avatarDefault}>
                            <Typography>{getUserInitials(user)}</Typography>
                          </div>
                        )}
                      </div>
                      <Typography>
                        {getUserName(user) || <Skeleton />}
                      </Typography>
                      <Typography
                        variant={"caption"}
                        className={classes.statusText}
                      >
                        {!user ? (
                          <Skeleton />
                        ) : user.isActive ? (
                          intl.formatMessage({
                            defaultMessage: "Active",
                            description: "staff member status"
                          })
                        ) : (
                          intl.formatMessage({
                            defaultMessage: "Inactive",
                            description: "staff member status"
                          })
                        )}
                      </Typography>
                    </TableCell>
                    <TableCell className={classes.colEmail}>
                      {user?.email || <Skeleton />}
                    </TableCell>
                    <TableCell className={classes.colActions}>
                      {user ? (
                        <>
                          <IconButton
                            disabled={disabled}
                            color="primary"
                            onClick={stopPropagation(() =>
                              onUnassign([user.id])
                            )}
                          >
                            <DeleteIcon />
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
                    <FormattedMessage defaultMessage="No members found" />
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </ResponsiveTable>
      )}
    </Card>
  );
};
PermissionGroupMemberList.displayName = "PermissionGroupMemberList";
export default PermissionGroupMemberList;
