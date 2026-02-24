import BackButton from "@dashboard/components/BackButton";
import { ConfirmButton, type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { InfiniteScroll } from "@dashboard/components/InfiniteScroll";
import { DashboardModal } from "@dashboard/components/Modal";
import { SaleorThrobber } from "@dashboard/components/Throbber";
import { UserAvatar } from "@dashboard/components/UserAvatar";
import { type SearchStaffMembersQuery } from "@dashboard/graphql";
import useSearchQuery from "@dashboard/hooks/useSearchQuery";
import { buttonMessages } from "@dashboard/intl";
import { getUserInitials, getUserName, renderCollection } from "@dashboard/misc";
import { type DialogProps, type FetchMoreProps, type RelayToFlat, type SearchPageProps } from "@dashboard/types";
import { Box, Checkbox, Input, Skeleton, Text } from "@saleor/macaw-ui-next";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";

type StaffMemberList = NonNullable<RelayToFlat<SearchStaffMembersQuery["search"]>>;
type StaffMember = StaffMemberList[number];

interface AssignMembersDialogProps extends DialogProps, FetchMoreProps, SearchPageProps {
  confirmButtonState: ConfirmButtonTransitionState;
  disabled: boolean;
  staffMembers: RelayToFlat<SearchStaffMembersQuery["search"]>;
  hasMore: boolean;
  onFetchMore: () => void;
  onSubmit: (data: StaffMemberList) => void;
}

function handleStaffMemberAssign(
  member: StaffMember,
  isSelected: boolean,
  selectedMembers: StaffMemberList,
  setSelectedMembers: (data: StaffMemberList) => void,
) {
  if (isSelected) {
    setSelectedMembers(selectedMembers.filter(selectedMember => selectedMember.id !== member.id));
  } else {
    setSelectedMembers([...selectedMembers, member]);
  }
}

const scrollableTargetId = "assignMemberScrollableDialog";

const AssignMembersDialog = ({
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
}: AssignMembersDialogProps) => {
  const intl = useIntl();
  const [query, onQueryChange] = useSearchQuery(onSearchChange);
  const [selectedMembers, setSelectedMembers] = useState<StaffMemberList>([]);

  return (
    <DashboardModal onChange={onClose} open={open}>
      <DashboardModal.Content size="sm" __gridTemplateRows="auto auto 1fr">
        <DashboardModal.Header>
          <FormattedMessage {...messages.title} />
        </DashboardModal.Header>

        <Input
          data-test-id="search-members-input"
          name="query"
          value={query}
          onChange={onQueryChange}
          label={intl.formatMessage(messages.searchInputLabel)}
          placeholder={intl.formatMessage(messages.searchInputPlaceholder)}
          width="100%"
          endAdornment={loading ? <SaleorThrobber size={16} /> : undefined}
          autoComplete="off"
          disabled={disabled}
        />

        <InfiniteScroll
          id={scrollableTargetId}
          dataLength={staffMembers?.length || 0}
          next={onFetchMore}
          hasMore={hasMore}
          scrollThreshold="100px"
          scrollableTarget={scrollableTargetId}
        >
          <Box display="flex" flexDirection="column" marginBottom={3} data-test-id="search-results">
            {renderCollection(
              staffMembers ?? undefined,
              member => {
                if (!member) {
                  return null;
                }

                const isSelected = selectedMembers.some(
                  selectedMember => selectedMember.id === member.id,
                );

                return (
                  <Box
                    key={member.id}
                    display="flex"
                    alignItems="center"
                    gap={3}
                    cursor="pointer"
                    paddingX={3}
                    paddingY={2}
                    data-test-id="user-row"
                    onClick={() =>
                      handleStaffMemberAssign(
                        member,
                        isSelected,
                        selectedMembers,
                        setSelectedMembers,
                      )
                    }
                  >
                    <Checkbox checked={isSelected} />
                    <UserAvatar url={member?.avatar?.url} initials={getUserInitials(member)} />
                    <Box display="flex" flexDirection="column" justifyContent="center" flexGrow="1">
                      <Text>{getUserName(member) || <Skeleton />}</Text>
                      <Text size={2} color="default2">
                        {member.isActive
                          ? intl.formatMessage(messages.staffActive)
                          : intl.formatMessage(messages.staffInactive)}
                      </Text>
                    </Box>
                  </Box>
                );
              },
              () =>
                !loading && (
                  <Box paddingX={3} paddingY={2}>
                    <FormattedMessage {...messages.noMembersFound} />
                  </Box>
                ),
            )}
          </Box>
        </InfiniteScroll>

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
