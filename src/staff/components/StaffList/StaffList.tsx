// @ts-strict-ignore
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import Skeleton from "@dashboard/components/Skeleton";
import TableCellHeader from "@dashboard/components/TableCellHeader";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import TableRowLink from "@dashboard/components/TableRowLink";
import { UserAvatar } from "@dashboard/components/UserAvatar";
import { StaffListQuery } from "@dashboard/graphql";
import { commonStatusMessages } from "@dashboard/intl";
import {
  getUserInitials,
  getUserName,
  renderCollection,
} from "@dashboard/misc";
import {
  StaffListUrlSortField,
  staffMemberDetailsUrl,
} from "@dashboard/staff/urls";
import { ListProps, RelayToFlat, SortPage } from "@dashboard/types";
import { getArrowDirection } from "@dashboard/utils/sort";
import {
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
} from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import { Box, Text } from "@saleor/macaw-ui/next";
import clsx from "clsx";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

const useStyles = makeStyles(
  {
    colEmail: {
      width: 400,
    },

    tableRow: {
      cursor: "pointer",
    },
    wideColumn: {
      width: "80%",
    },
  },
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
                <Box display="flex" alignItems="center" gap={2}>
                  <UserAvatar
                    url={staffMember?.avatar?.url}
                    initials={getUserInitials(staffMember)}
                  />
                  <Box display="flex" flexDirection="column">
                    <Text>{getUserName(staffMember) || <Skeleton />}</Text>
                    <Text
                      variant="caption"
                      data-test-id="staffStatusText"
                      color="textNeutralSubdued"
                    >
                      {staffMember?.isActive
                        ? intl.formatMessage(commonStatusMessages.active)
                        : intl.formatMessage(commonStatusMessages.notActive)}
                    </Text>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                <Text size="small" data-test-id="user-mail">
                  {staffMember?.email}
                </Text>
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
