// @ts-strict-ignore
import BackButton from "@dashboard/components/BackButton";
import CardSpacer from "@dashboard/components/CardSpacer";
import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import TableRowLink from "@dashboard/components/TableRowLink";
import { UserAvatar } from "@dashboard/components/UserAvatar";
import { SearchStaffMembersQuery } from "@dashboard/graphql";
import useSearchQuery from "@dashboard/hooks/useSearchQuery";
import { buttonMessages } from "@dashboard/intl";
import { getUserInitials, getUserName, renderCollection } from "@dashboard/misc";
import { DialogProps, FetchMoreProps, RelayToFlat, SearchPageProps } from "@dashboard/types";
import { Checkbox, CircularProgress, TableBody, TableCell, TextField } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import { Box, Skeleton, Text } from "@saleor/macaw-ui-next";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";

const useStyles = makeStyles(
  theme => ({
    avatarCell: {
      padding: 0,
      width: 32,
    },
    avatarDefault: {
      "& div": {
        color: "#fff",
        lineHeight: 2.8,
        fontSize: "0.75rem",
      },
      background: theme.palette.primary.main,
      height: 32,
      textAlign: "center",
      width: 32,
    },
    avatarImage: {
      pointerEvents: "none",
      width: "100%",
    },
    checkboxCell: {
      "&&:not(first-child)": {
        paddingLeft: 0,
        paddingRight: 0,
        width: 48,
      },
    },
    colActions: {
      textAlign: "right",
    },
    colName: {
      paddingLeft: theme.spacing(),
    },
    dialogPaper: {
      overflow: "hidden",
    },
    dropShadow: {
      boxShadow: `0px -5px 10px 0px ${theme.palette.divider}`,
    },
    inputContainer: {
      overflowY: "visible",
    },
    loadMoreLoaderContainer: {
      alignItems: "center",
      display: "flex",
      gridColumnEnd: "span 3",
      height: theme.spacing(4),
      justifyContent: "center",
    },
    overflow: {
      overflowY: "visible",
    },
    table: {
      marginBottom: theme.spacing(3),
    },
    wideCell: {
      width: "80%",
    },
  }),
  { name: "AssignStaffMembersDialog" },
);

export interface AssignMembersDialogProps extends DialogProps, FetchMoreProps, SearchPageProps {
  confirmButtonState: ConfirmButtonTransitionState;
  disabled: boolean;
  staffMembers: RelayToFlat<SearchStaffMembersQuery["search"]>;
  hasMore: boolean;
  onFetchMore: () => void;
  onSubmit: (data: RelayToFlat<SearchStaffMembersQuery["search"]>) => void;
}

function handleStaffMemberAssign(
  member: RelayToFlat<SearchStaffMembersQuery["search"]>[0],
  isSelected: boolean,
  selectedMembers: RelayToFlat<SearchStaffMembersQuery["search"]>,
  setSelectedMembers: (data: RelayToFlat<SearchStaffMembersQuery["search"]>) => void,
) {
  if (isSelected) {
    setSelectedMembers(selectedMembers.filter(selectedMember => selectedMember.id !== member.id));
  } else {
    setSelectedMembers([...selectedMembers, member]);
  }
}

const scrollableTargetId = "assignMemberScrollableDialog";

const AssignMembersDialog: React.FC<AssignMembersDialogProps> = ({
  confirmButtonState,
  disabled,
  loading,
  onClose,
  onFetchMore,
  hasMore,
  onSearchChange,
  onSubmit,
  open,
  staffMembers,
}) => {
  const intl = useIntl();
  const classes = useStyles({});
  const [query, onQueryChange] = useSearchQuery(onSearchChange);
  const [selectedMembers, setSelectedMembers] = React.useState<
    RelayToFlat<SearchStaffMembersQuery["search"]>
  >([]);

  return (
    <DashboardModal onChange={onClose} open={open}>
      <DashboardModal.Content size="sm" __gridTemplateRows="auto auto 1fr">
        <DashboardModal.Title>
          <FormattedMessage {...messages.title} />
        </DashboardModal.Title>

        <TextField
          data-test-id="search-members-input"
          name="query"
          value={query}
          onChange={onQueryChange}
          label={intl.formatMessage(messages.searchInputLabel)}
          placeholder={intl.formatMessage(messages.searchInputPlaceholder)}
          fullWidth
          InputProps={{
            autoComplete: "off",
            endAdornment: loading && <CircularProgress size={16} />,
          }}
          disabled={disabled}
        />

        <Box id={scrollableTargetId} overflowY="auto">
          <InfiniteScroll
            dataLength={staffMembers?.length || 0}
            next={onFetchMore}
            hasMore={hasMore}
            scrollThreshold="100px"
            scrollableTarget={scrollableTargetId}
            loader={
              <>
                {staffMembers?.length > 0 && <CardSpacer />}
                <div className={classes.loadMoreLoaderContainer}>
                  <CircularProgress size={24} />
                </div>
              </>
            }
          >
            <ResponsiveTable className={classes.table}>
              <TableBody data-test-id="search-results">
                {renderCollection(
                  staffMembers,
                  member => {
                    if (!member) {
                      return null;
                    }

                    const isSelected = selectedMembers.some(
                      selectedMember => selectedMember.id === member.id,
                    );

                    return (
                      <TableRowLink key={member.id} data-test-id="user-row">
                        <TableCell padding="checkbox" className={classes.checkboxCell}>
                          <Checkbox
                            color="primary"
                            checked={isSelected}
                            onChange={() =>
                              handleStaffMemberAssign(
                                member,
                                isSelected,
                                selectedMembers,
                                setSelectedMembers,
                              )
                            }
                          />
                        </TableCell>
                        <TableCell className={classes.avatarCell}>
                          <UserAvatar
                            url={member?.avatar?.url}
                            initials={getUserInitials(member)}
                          />
                        </TableCell>
                        <TableCell className={classes.colName}>
                          <Box display="flex" flexDirection="column" justifyContent="center">
                            <Text>{getUserName(member) || <Skeleton />}</Text>
                            <Text size={2} color="default2">
                              {member ? (
                                member.isActive ? (
                                  intl.formatMessage(messages.staffActive)
                                ) : (
                                  intl.formatMessage(messages.staffInactive)
                                )
                              ) : (
                                <Skeleton />
                              )}
                            </Text>
                          </Box>
                        </TableCell>
                      </TableRowLink>
                    );
                  },
                  () =>
                    !loading && (
                      <TableRowLink>
                        <TableCell colSpan={2}>
                          <FormattedMessage {...messages.noMembersFound} />
                        </TableCell>
                      </TableRowLink>
                    ),
                )}
              </TableBody>
            </ResponsiveTable>
          </InfiniteScroll>
        </Box>

        <DashboardModal.Actions>
          <BackButton onClick={onClose} />
          <ConfirmButton
            data-test-id="submit"
            type="submit"
            transitionState={confirmButtonState}
            onClick={() => {
              onSubmit(selectedMembers);
            }}
          >
            <FormattedMessage {...buttonMessages.assign} />
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

AssignMembersDialog.displayName = "AssignMembersDialog";
export default AssignMembersDialog;
