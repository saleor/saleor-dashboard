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
  maybe,
  renderCollection
} from "@saleor/misc";
import { ListActions } from "@saleor/types";
import TableCellHeader from "@saleor/components/TableCellHeader";
import Checkbox from "@saleor/components/Checkbox";

import { Button, IconButton } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import { PermissionGroupDetails_permissionGroup_users } from "../../types/PermissionGroupDetails";
import { stopPropagation } from "../../../misc";

const useStyles = makeStyles(
  theme => ({
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
      textAlign: "right"
    },
    statusText: {
      color: "#9E9D9D"
    },
    tableRow: {
      cursor: "pointer"
    },
    wideColumn: {
      width: "80%"
    }
  }),
  { name: "PermissionGroup" }
);
const numberOfColumns = 4;

interface PermissionGroupProps extends ListActions {
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
    toggle,
    toolbar,
    isChecked,
    selected,
    toggleAll
  } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Group members",
          description: "header"
        })}
        toolbar={
          <Button color="primary" onClick={onAssign}>
            <FormattedMessage
              defaultMessage="Assign members"
              description="button"
            />
          </Button>
        }
      />
      <ResponsiveTable>
        <TableHead
          colSpan={numberOfColumns}
          selected={selected}
          disabled={disabled}
          items={users}
          toggleAll={toggleAll}
          toolbar={toolbar}
        >
          <TableCellHeader className={classes.wideColumn}>
            <FormattedMessage
              defaultMessage="Name"
              description="staff member full name"
            />
          </TableCellHeader>
          <TableCellHeader>
            <FormattedMessage defaultMessage="Email Address" />
          </TableCellHeader>
          <TableCellHeader>
            <FormattedMessage defaultMessage="Actions" />
          </TableCellHeader>
        </TableHead>
        <TableBody>
          {renderCollection(
            users,
            user => {
              const isSelected = user ? isChecked(user.id) : false;

              return (
                <TableRow
                  className={classNames({
                    [classes.tableRow]: !!user
                  })}
                  hover={!!user}
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
                  <TableCell>
                    <div className={classes.avatar}>
                      {maybe(() => user.avatar.url) ? (
                        <img
                          className={classes.avatarImage}
                          src={maybe(() => user.avatar.url)}
                        />
                      ) : (
                        <div className={classes.avatarDefault}>
                          <Typography>{getUserInitials(user)}</Typography>
                        </div>
                      )}
                    </div>
                    <Typography>{getUserName(user) || <Skeleton />}</Typography>
                    <Typography
                      variant={"caption"}
                      className={classes.statusText}
                    >
                      {maybe<React.ReactNode>(
                        () =>
                          user.isActive
                            ? intl.formatMessage({
                                defaultMessage: "Active",
                                description: "staff member status"
                              })
                            : intl.formatMessage({
                                defaultMessage: "Inactive",
                                description: "staff member status"
                              }),
                        <Skeleton />
                      )}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {maybe<React.ReactNode>(() => user.email, <Skeleton />)}
                  </TableCell>
                  <TableCell className={classes.colActions}>
                    {user ? (
                      <>
                        <IconButton
                          color="primary"
                          onClick={stopPropagation(() => onUnassign([user.id]))}
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
    </Card>
  );
};
PermissionGroupMemberList.displayName = "PermissionGroupMemberList";
export default PermissionGroupMemberList;
