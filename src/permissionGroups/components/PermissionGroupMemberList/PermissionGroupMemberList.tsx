// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import Checkbox from "@dashboard/components/Checkbox";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import TableCellHeader from "@dashboard/components/TableCellHeader";
import TableHead from "@dashboard/components/TableHead";
import TableRowLink from "@dashboard/components/TableRowLink";
import { UserAvatar } from "@dashboard/components/UserAvatar";
import { PermissionGroupMemberFragment } from "@dashboard/graphql";
import { commonStatusMessages } from "@dashboard/intl";
import { getUserInitials, getUserName, renderCollection, stopPropagation } from "@dashboard/misc";
import { sortMembers } from "@dashboard/permissionGroups/sort";
import { MembersListUrlSortField } from "@dashboard/permissionGroups/urls";
import { ListActions, SortPage } from "@dashboard/types";
import { getArrowDirection } from "@dashboard/utils/sort";
import { TableBody, TableCell } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import { Box, Button, Skeleton, Text, TrashBinIcon, vars } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    [theme.breakpoints.up("lg")]: {
      colActions: {
        width: 120,
      },
      colEmail: {
        width: 300,
      },
    },
    colName: {
      display: "flex",
      alignItems: "center",
      gap: vars.spacing[2],
    },
    avatarDefault: {
      "& div": {
        color: theme.palette.primary.contrastText,
        lineHeight: "47px",
      },
      background: theme.palette.primary.main,
      height: 47,
      textAlign: "center",
      width: 47,
    },
    avatarImage: {
      pointerEvents: "none",
      width: "100%",
    },
    colActions: {
      textAlign: "right",
    },
    helperText: {
      textAlign: "center",
    },
    tableRow: {},
  }),
  { name: "PermissionGroup" },
);
const numberOfColumns = 4;

interface PermissionGroupProps extends ListActions, SortPage<MembersListUrlSortField> {
  users: PermissionGroupMemberFragment[];
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
    sort,
  } = props;
  const classes = useStyles(props);
  const intl = useIntl();
  const members = [...users].sort(sortMembers(sort?.sort, sort?.asc));

  return (
    <DashboardCard data-test-id="permission-group-members-section">
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage({
            id: "lGlDEH",
            defaultMessage: "Group members",
            description: "header",
          })}
        </DashboardCard.Title>

        <DashboardCard.Toolbar>
          <Button
            data-test-id="assign-members"
            variant="secondary"
            onClick={onAssign}
            disabled={disabled}
          >
            <FormattedMessage id="OhFGpX" defaultMessage="Assign members" description="button" />
          </Button>
        </DashboardCard.Toolbar>
      </DashboardCard.Header>
      {members?.length === 0 ? (
        <DashboardCard.Content className={classes.helperText} data-test-id="no-members-text">
          <Text color="default2">
            <FormattedMessage
              id="gVD1os"
              defaultMessage="You haven’t assigned any member to this permission group yet."
              description="empty list message"
            />
          </Text>
          <Text color="default2">
            <FormattedMessage
              id="zD7/M6"
              defaultMessage="Please use Assign Members button to do so."
              description="empty list message"
            />
          </Text>
        </DashboardCard.Content>
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
                id="W32xfN"
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
              <FormattedMessage id="xxQxLE" defaultMessage="Email Address" />
            </TableCellHeader>
            <TableCellHeader textAlign="right">
              <FormattedMessage id="wL7VAE" defaultMessage="Actions" />
            </TableCellHeader>
          </TableHead>
          <TableBody data-test-id="assigned-members-table">
            {renderCollection(
              members,
              user => {
                const isSelected = user ? isChecked(user.id) : false;

                return (
                  <TableRowLink
                    data-test-id="assigned-member-row"
                    className={clsx({
                      [classes.tableRow]: !!user,
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
                      <UserAvatar initials={getUserInitials(user)} url={user?.avatar?.url} />
                      <Box display="flex" flexDirection="column">
                        <Text data-test-id="member-name">{getUserName(user) || <Skeleton />}</Text>
                        <Text size={2} color="default2">
                          {!user ? (
                            <Skeleton />
                          ) : user.isActive ? (
                            intl.formatMessage(commonStatusMessages.active)
                          ) : (
                            intl.formatMessage(commonStatusMessages.notActive)
                          )}
                        </Text>
                      </Box>
                    </TableCell>
                    <TableCell className={classes.colEmail}>
                      {user?.email || <Skeleton />}
                    </TableCell>
                    <TableCell className={classes.colActions}>
                      {user ? (
                        <>
                          <Button
                            icon={<TrashBinIcon />}
                            variant="secondary"
                            data-test-id="remove-user"
                            disabled={disabled}
                            onClick={stopPropagation(() => onUnassign([user.id]))}
                            marginLeft="auto"
                          />
                        </>
                      ) : (
                        <Skeleton />
                      )}
                    </TableCell>
                  </TableRowLink>
                );
              },
              () => (
                <TableRowLink>
                  <TableCell colSpan={numberOfColumns}>
                    <FormattedMessage id="qrWOxx" defaultMessage="No members found" />
                  </TableCell>
                </TableRowLink>
              ),
            )}
          </TableBody>
        </ResponsiveTable>
      )}
    </DashboardCard>
  );
};

PermissionGroupMemberList.displayName = "PermissionGroupMemberList";
export default PermissionGroupMemberList;
