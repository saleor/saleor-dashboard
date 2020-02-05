import { makeStyles } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import classNames from "classnames";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import TablePagination from "@saleor/components/TablePagination";
import {
  getUserInitials,
  getUserName,
  maybe,
  renderCollection
} from "@saleor/misc";
import { ListProps } from "@saleor/types";
// import { MembersListUrlSortField } from "@saleor/staff/urls";
import TableCellHeader from "@saleor/components/TableCellHeader";
// import { getArrowDirection } from "@saleor/utils/sort";
import { PermissionGroupDetails_permissionGroup_users } from "../../types/PermissionGroupDetails";
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
  { name: "MembersList" }
);

interface MembersListProps extends ListProps {
  members: PermissionGroupDetails_permissionGroup_users[];
}

const MembersList: React.FC<MembersListProps> = props => {
  const {
    settings,
    disabled,
    onNextPage,
    onPreviousPage,
    onUpdateListSettings,
    onRowClick,
    pageInfo,
    members
  } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  return (
    <ResponsiveTable>
      <TableHead>
        <TableRow>
          <TableCellHeader
            // direction={
            //   sort.sort === MembersListUrlSortField.name
            //     ? getArrowDirection(sort.asc)
            //     : undefined
            // }
            // arrowPosition="right"
            // onClick={() => onSort(MembersListUrlSortField.name)}
            className={classes.wideColumn}
          >
            <FormattedMessage
              defaultMessage="Name"
              description="staff member full name"
            />
          </TableCellHeader>
          <TableCellHeader
          // direction={
          //   sort.sort === MembersListUrlSortField.email
          //     ? getArrowDirection(sort.asc)
          //     : undefined
          // }
          // onClick={() => onSort(MembersListUrlSortField.email)}
          >
            <FormattedMessage defaultMessage="Email Address" />
          </TableCellHeader>
        </TableRow>
      </TableHead>
      <TableFooter>
        <TableRow>
          <TablePagination
            colSpan={3}
            settings={settings}
            hasNextPage={
              pageInfo && !disabled ? pageInfo.hasNextPage : undefined
            }
            onNextPage={onNextPage}
            onUpdateListSettings={onUpdateListSettings}
            hasPreviousPage={
              pageInfo && !disabled ? pageInfo.hasPreviousPage : undefined
            }
            onPreviousPage={onPreviousPage}
          />
        </TableRow>
      </TableFooter>
      <TableBody>
        {renderCollection(
          members,
          member => (
            <TableRow
              className={classNames({
                [classes.tableRow]: !!member
              })}
              hover={!!member}
              onClick={!!member ? onRowClick(member.id) : undefined}
              key={member ? member.id : "skeleton"}
            >
              <TableCell>
                <div className={classes.avatar}>
                  {maybe(() => member.avatar.url) ? (
                    <img
                      className={classes.avatarImage}
                      src={maybe(() => member.avatar.url)}
                    />
                  ) : (
                    <div className={classes.avatarDefault}>
                      <Typography>{getUserInitials(member)}</Typography>
                    </div>
                  )}
                </div>
                <Typography>{getUserName(member) || <Skeleton />}</Typography>
                <Typography variant={"caption"} className={classes.statusText}>
                  {maybe<React.ReactNode>(
                    () =>
                      member.isActive
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
                {maybe<React.ReactNode>(() => member.email, <Skeleton />)}
              </TableCell>
            </TableRow>
          ),
          () => (
            <TableRow>
              <TableCell colSpan={3}>
                <FormattedMessage defaultMessage="No staff members found" />
              </TableCell>
            </TableRow>
          )
        )}
      </TableBody>
    </ResponsiveTable>
  );
};
MembersList.displayName = "MembersList";
export default MembersList;
