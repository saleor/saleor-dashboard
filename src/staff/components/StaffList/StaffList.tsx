import {
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  Typography,
} from "@material-ui/core";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import TableCellHeader from "@saleor/components/TableCellHeader";
import { TablePaginationWithContext } from "@saleor/components/TablePagination";
import TableRowLink from "@saleor/components/TableRowLink";
import { StaffListQuery } from "@saleor/graphql";
import { makeStyles } from "@saleor/macaw-ui";
import {
  getUserInitials,
  getUserName,
  maybe,
  renderCollection,
} from "@saleor/misc";
import {
  StaffListUrlSortField,
  staffMemberDetailsUrl,
} from "@saleor/staff/urls";
import { ListProps, RelayToFlat, SortPage } from "@saleor/types";
import { getArrowDirection } from "@saleor/utils/sort";
import clsx from "clsx";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

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
      width: 47,
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
    colEmail: {
      width: 400,
    },
    statusText: {
      color: "#9E9D9D",
    },
    tableRow: {
      cursor: "pointer",
    },
    wideColumn: {
      width: "80%",
    },
  }),
  { name: "StaffList" },
);

interface StaffListProps extends ListProps, SortPage<StaffListUrlSortField> {
  staffMembers: RelayToFlat<StaffListQuery["staffUsers"]>;
}

const numberOfColumns = 2;

const StaffList: React.FC<StaffListProps> = props => {
  const {
    settings,
    disabled,
    onUpdateListSettings,
    onSort,
    sort,
    staffMembers,
  } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  return (
    <ResponsiveTable>
      <colgroup>
        <col />
        <col className={classes.colEmail} />
      </colgroup>
      <TableHead>
        <TableRowLink>
          <TableCellHeader
            direction={
              sort.sort === StaffListUrlSortField.name
                ? getArrowDirection(sort.asc)
                : undefined
            }
            arrowPosition="right"
            onClick={() => onSort(StaffListUrlSortField.name)}
            className={classes.wideColumn}
          >
            <FormattedMessage
              id="W32xfN"
              defaultMessage="Name"
              description="staff member full name"
            />
          </TableCellHeader>
          <TableCellHeader
            direction={
              sort.sort === StaffListUrlSortField.email
                ? getArrowDirection(sort.asc)
                : undefined
            }
            onClick={() => onSort(StaffListUrlSortField.email)}
          >
            <FormattedMessage id="xxQxLE" defaultMessage="Email Address" />
          </TableCellHeader>
        </TableRowLink>
      </TableHead>
      <TableFooter>
        <TableRowLink>
          <TablePaginationWithContext
            colSpan={numberOfColumns}
            disabled={disabled}
            settings={settings}
            onUpdateListSettings={onUpdateListSettings}
          />
        </TableRowLink>
      </TableFooter>
      <TableBody>
        {renderCollection(
          staffMembers,
          staffMember => (
            <TableRowLink
              className={clsx({
                [classes.tableRow]: !!staffMember,
              })}
              hover={!!staffMember}
              href={staffMember && staffMemberDetailsUrl(staffMember.id)}
              key={staffMember ? staffMember.id : "skeleton"}
            >
              <TableCell>
                <div className={classes.avatar} data-test-id="staffAvatar">
                  {maybe(() => staffMember.avatar.url) ? (
                    <img
                      className={classes.avatarImage}
                      src={maybe(() => staffMember.avatar.url)}
                    />
                  ) : (
                    <div className={classes.avatarDefault}>
                      <Typography>{getUserInitials(staffMember)}</Typography>
                    </div>
                  )}
                </div>
                <Typography>
                  {getUserName(staffMember) || <Skeleton />}
                </Typography>
                <Typography
                  variant={"caption"}
                  className={classes.statusText}
                  data-test-id="staffStatusText"
                >
                  {maybe<React.ReactNode>(
                    () =>
                      staffMember.isActive
                        ? intl.formatMessage({
                            id: "9Zlogd",
                            defaultMessage: "Active",
                            description: "staff member status",
                          })
                        : intl.formatMessage({
                            id: "7WzUxn",
                            defaultMessage: "Inactive",
                            description: "staff member status",
                          }),
                    <Skeleton />,
                  )}
                </Typography>
              </TableCell>
              <TableCell>
                {maybe<React.ReactNode>(() => staffMember.email, <Skeleton />)}
              </TableCell>
            </TableRowLink>
          ),
          () => (
            <TableRowLink>
              <TableCell colSpan={numberOfColumns}>
                <FormattedMessage
                  id="xJQX5t"
                  defaultMessage="No staff members found"
                />
              </TableCell>
            </TableRowLink>
          ),
        )}
      </TableBody>
    </ResponsiveTable>
  );
};
StaffList.displayName = "StaffList";
export default StaffList;
