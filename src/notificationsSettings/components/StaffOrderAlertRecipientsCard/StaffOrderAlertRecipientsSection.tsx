import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import { type SearchStaffMembersQuery } from "@dashboard/graphql";
import { useStaffOrderAlertRecipients } from "@dashboard/notificationsSettings/hooks/useStaffOrderAlertRecipients";
import AssignMembersDialog from "@dashboard/permissionGroups/components/AssignMembersDialog/AssignMembersDialog";
import useStaffMemberSearch from "@dashboard/searches/useStaffMemberSearch";
import { type RelayToFlat } from "@dashboard/types";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { useState } from "react";

import { StaffOrderAlertRecipientsCard } from "./StaffOrderAlertRecipientsCard";

interface StaffOrderAlertRecipientsSectionProps {
  staffEmailsEnabled: boolean | null;
}

export const StaffOrderAlertRecipientsSection = ({
  staffEmailsEnabled,
}: StaffOrderAlertRecipientsSectionProps): JSX.Element | null => {
  const { canManageSettings, canManageStaff, recipients, loading, mutating, onAssign, onRemove } =
    useStaffOrderAlertRecipients();
  const [assignOpen, setAssignOpen] = useState(false);
  const {
    search,
    result: searchResult,
    loadMore,
  } = useStaffMemberSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA,
    skip: !canManageStaff,
  });

  if (!canManageSettings) {
    return null;
  }

  const handleSubmit = async (
    members: RelayToFlat<SearchStaffMembersQuery["search"]>,
  ): Promise<void> => {
    await onAssign(members ?? []);
    setAssignOpen(false);
  };

  return (
    <>
      <StaffOrderAlertRecipientsCard
        recipients={recipients}
        loading={loading}
        disabled={mutating}
        canManageStaff={canManageStaff}
        staffEmailsEnabled={staffEmailsEnabled}
        onAssign={() => setAssignOpen(true)}
        onRemove={onRemove}
      />
      {canManageStaff ? (
        <AssignMembersDialog
          loading={searchResult.loading}
          staffMembers={mapEdgesToItems(searchResult?.data?.search) ?? []}
          onSearchChange={search}
          onFetchMore={loadMore}
          disabled={mutating}
          hasMore={searchResult?.data?.search?.pageInfo?.hasNextPage ?? false}
          initialSearch=""
          confirmButtonState={mutating ? "loading" : "default"}
          open={assignOpen}
          onClose={() => setAssignOpen(false)}
          onSubmit={handleSubmit}
        />
      ) : null}
    </>
  );
};
