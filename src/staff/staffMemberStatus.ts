import { type DotStatus } from "@dashboard/components/StatusDot/StatusDot";
import { type StaffMemberDetailsFragment, type UserFragment } from "@dashboard/graphql";
import { commonStatusMessages } from "@dashboard/intl";
import { type IntlShape } from "react-intl";

import { staffMemberStatusMessages } from "./staffMemberStatusMessages";

export interface StaffMemberStatusDisplay {
  label: string;
  /** Status-dot tone for detail titles and status cells. */
  dot: DotStatus;
}

type StaffMemberWithLogin = Pick<StaffMemberDetailsFragment, "lastLogin"> | UserFragment;

/**
 * Staff invites do not flip `isConfirmed` (it defaults to true on User).
 * Never having signed in is the best API signal that the invite is unfinished.
 */
export const isStaffInvitePending = (
  staffMember: StaffMemberWithLogin | null | undefined,
): boolean => {
  if (!staffMember || !("lastLogin" in staffMember)) {
    return false;
  }

  return staffMember.lastLogin == null;
};

/**
 * List/header status for a staff member.
 * Pending invite = active account that has never signed in.
 */
export const getStaffMemberStatusDisplay = ({
  isActive,
  invitePending,
  intl,
}: {
  isActive: boolean;
  invitePending: boolean;
  intl: IntlShape;
}): StaffMemberStatusDisplay => {
  if (!isActive) {
    return {
      label: intl.formatMessage(commonStatusMessages.notActive),
      dot: "neutral",
    };
  }

  if (invitePending) {
    return {
      label: intl.formatMessage(staffMemberStatusMessages.pendingInvite),
      dot: "warning",
    };
  }

  return {
    label: intl.formatMessage(commonStatusMessages.active),
    dot: "success",
  };
};
