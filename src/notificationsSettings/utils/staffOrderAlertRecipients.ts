export interface StaffOrderAlertRecipient {
  id: string;
  email: string;
  active: boolean;
  userId: string | null;
  firstName: string | null;
  lastName: string | null;
  isStaffActive: boolean | null;
}

export interface StaffOrderAlertRecipientUser {
  id?: string | null;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  isActive?: boolean | null;
}

export interface StaffOrderAlertRecipientNode {
  id: string;
  email?: string | null;
  active?: boolean | null;
  user?: StaffOrderAlertRecipientUser | null;
}

export const mapStaffOrderAlertRecipient = (
  node: StaffOrderAlertRecipientNode,
): StaffOrderAlertRecipient => ({
  id: node.id,
  email: node.email ?? node.user?.email ?? "",
  active: node.active ?? false,
  userId: node.user?.id ?? null,
  firstName: node.user?.firstName ?? null,
  lastName: node.user?.lastName ?? null,
  isStaffActive: node.user ? (node.user.isActive ?? false) : null,
});

export const mapStaffOrderAlertRecipients = (
  nodes: Array<StaffOrderAlertRecipientNode | null> | null | undefined,
): StaffOrderAlertRecipient[] =>
  (nodes ?? []).flatMap(node => (node ? [mapStaffOrderAlertRecipient(node)] : []));

/** Core only emails linked, active staff users. Email-only rows are stored but never sent. */
export const recipientWillReceiveOrderAlert = (recipient: StaffOrderAlertRecipient): boolean =>
  recipient.active && recipient.userId !== null && recipient.isStaffActive === true;

export const assignedStaffUserIds = (recipients: StaffOrderAlertRecipient[]): Set<string> =>
  new Set(recipients.flatMap(recipient => (recipient.userId ? [recipient.userId] : [])));

export const recipientDisplayName = (recipient: StaffOrderAlertRecipient): string => {
  const name = [recipient.firstName, recipient.lastName].filter(Boolean).join(" ").trim();

  return name || recipient.email;
};

/**
 * Shop.staffNotificationRecipients.id is a raw PK today (Core uses graphene.ID,
 * not GlobalID). Delete/update still require a Relay id (`Type:pk` base64).
 * Keep already-encoded ids so this stays safe if Core starts returning GlobalID.
 */
const STAFF_NOTIFICATION_RECIPIENT_TYPE = "StaffNotificationRecipient";

export const toStaffNotificationRecipientGraphqlId = (id: string): string => {
  try {
    if (atob(id).startsWith(`${STAFF_NOTIFICATION_RECIPIENT_TYPE}:`)) {
      return id;
    }
  } catch {
    // Not base64 — treat as a raw PK.
  }

  return btoa(`${STAFF_NOTIFICATION_RECIPIENT_TYPE}:${id}`);
};
