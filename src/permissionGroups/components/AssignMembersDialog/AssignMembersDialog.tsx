import {
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import BackButton from "@saleor/components/BackButton";
import CardSpacer from "@saleor/components/CardSpacer";
import ConfirmButton from "@saleor/components/ConfirmButton";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import { SearchStaffMembersQuery } from "@saleor/graphql";
import useElementScroll, {
  isScrolledToBottom,
} from "@saleor/hooks/useElementScroll";
import useSearchQuery from "@saleor/hooks/useSearchQuery";
import { buttonMessages } from "@saleor/intl";
import { ConfirmButtonTransitionState, makeStyles } from "@saleor/macaw-ui";
import { getUserInitials, getUserName, renderCollection } from "@saleor/misc";
import {
  DialogProps,
  FetchMoreProps,
  RelayToFlat,
  SearchPageProps,
} from "@saleor/types";
import classNames from "classnames";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";

const useStyles = makeStyles(
  theme => ({
    avatar: {
      alignItems: "center",
      borderRadius: "100%",
      display: "grid",
      float: "left",
      height: 32,
      justifyContent: "center",
      overflow: "hidden",
      width: 32,
    },
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
    scrollArea: {
      maxHeight: 400,
      overflowY: "scroll",
      paddingTop: 0,
      paddingBottom: 0,
    },
    table: {
      marginBottom: theme.spacing(3),
    },
    statusText: {
      color: "#9E9D9D",
    },
    wideCell: {
      width: "80%",
    },
  }),
  { name: "AssignStaffMembersDialog" },
);

export interface AssignMembersDialogProps
  extends DialogProps,
    FetchMoreProps,
    SearchPageProps {
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
  setSelectedMembers: (
    data: RelayToFlat<SearchStaffMembersQuery["search"]>,
  ) => void,
) {
  if (isSelected) {
    setSelectedMembers(
      selectedMembers.filter(selectedMember => selectedMember.id !== member.id),
    );
  } else {
    setSelectedMembers([...selectedMembers, member]);
  }
}

const scrollableTargetId = "assignMembersScrollableDialog";

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

  const anchor = React.useRef<HTMLDivElement>();
  const scrollPosition = useElementScroll(anchor);
  const dropShadow = !isScrolledToBottom(anchor, scrollPosition);

  return (
    <Dialog
      onClose={onClose}
      open={open}
      maxWidth="sm"
      fullWidth
      classes={{
        paper: classes.dialogPaper,
      }}
    >
      <DialogTitle>
        <FormattedMessage {...messages.title} />
      </DialogTitle>
      <DialogContent className={classes.inputContainer}>
        <TextField
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
      </DialogContent>
      <DialogContent
        className={classes.scrollArea}
        ref={anchor}
        id={scrollableTargetId}
      >
        <InfiniteScroll
          dataLength={staffMembers?.length || 0}
          next={onFetchMore}
          hasMore={hasMore}
          scrollThreshold="100px"
          loader={
            <>
              {staffMembers?.length > 0 && <CardSpacer />}
              <div className={classes.loadMoreLoaderContainer}>
                <CircularProgress size={24} />
              </div>
            </>
          }
          scrollableTarget={scrollableTargetId}
        >
          <ResponsiveTable className={classes.table}>
            <TableBody>
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
                    <TableRow key={member.id} data-test-id="user-row">
                      <TableCell
                        padding="checkbox"
                        className={classes.checkboxCell}
                      >
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
                        <div className={classes.avatar}>
                          {!!member?.avatar?.url ? (
                            <img
                              className={classes.avatarImage}
                              src={member.avatar.url}
                            />
                          ) : (
                            <div className={classes.avatarDefault}>
                              <Typography>{getUserInitials(member)}</Typography>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className={classes.colName}>
                        <Typography>
                          {getUserName(member) || <Skeleton />}
                        </Typography>
                        <Typography
                          variant={"caption"}
                          className={classes.statusText}
                        >
                          {!!member ? (
                            member.isActive ? (
                              intl.formatMessage(messages.staffActive)
                            ) : (
                              intl.formatMessage(messages.staffInactive)
                            )
                          ) : (
                            <Skeleton />
                          )}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                },
                () =>
                  !loading && (
                    <TableRow>
                      <TableCell colSpan={2}>
                        <FormattedMessage {...messages.noMembersFound} />
                      </TableCell>
                    </TableRow>
                  ),
              )}
            </TableBody>
          </ResponsiveTable>
        </InfiniteScroll>
      </DialogContent>
      <DialogActions
        className={classNames({
          [classes.dropShadow]: dropShadow,
        })}
      >
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
      </DialogActions>
    </Dialog>
  );
};
AssignMembersDialog.displayName = "AssignMembersDialog";
export default AssignMembersDialog;
