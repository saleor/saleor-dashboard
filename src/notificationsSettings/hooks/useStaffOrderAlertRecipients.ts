import {
  PermissionEnum,
  ShopErrorCode,
  StaffNotificationRecipientsDocument,
  useStaffNotificationRecipientCreateMutation,
  useStaffNotificationRecipientDeleteMutation,
  useStaffNotificationRecipientsQuery,
} from "@dashboard/graphql";
import { useNotifier } from "@dashboard/hooks/useNotifier/useNotifier";
import { notificationsMessages } from "@dashboard/notificationsSettings/messages";
import {
  assignedStaffUserIds,
  mapStaffOrderAlertRecipients,
  type StaffOrderAlertRecipient,
  toStaffNotificationRecipientGraphqlId,
} from "@dashboard/notificationsSettings/utils/staffOrderAlertRecipients";
import { useHasPermission } from "@dashboard/search/useHasPermission";
import { useCallback, useMemo } from "react";
import { useIntl } from "react-intl";

interface AssignableStaffMember {
  id: string;
  isActive: boolean;
}

const isDuplicateRecipientError = (errors: Array<{ code?: ShopErrorCode | string }>): boolean =>
  errors.some(
    error => error.code === ShopErrorCode.UNIQUE || error.code === ShopErrorCode.ALREADY_EXISTS,
  );

interface UseStaffOrderAlertRecipients {
  canManageSettings: boolean;
  canManageStaff: boolean;
  recipients: StaffOrderAlertRecipient[];
  loading: boolean;
  mutating: boolean;
  onAssign: (members: Array<AssignableStaffMember | null | undefined>) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
}

export const useStaffOrderAlertRecipients = (): UseStaffOrderAlertRecipients => {
  const intl = useIntl();
  const notify = useNotifier();
  const hasPermission = useHasPermission();
  const canManageSettings = hasPermission(PermissionEnum.MANAGE_SETTINGS);
  const canManageStaff = hasPermission(PermissionEnum.MANAGE_STAFF);

  const { data, loading } = useStaffNotificationRecipientsQuery({
    skip: !canManageSettings,
    variables: { canManageStaff },
  });

  const recipients = useMemo(
    () => mapStaffOrderAlertRecipients(data?.shop.staffNotificationRecipients),
    [data?.shop.staffNotificationRecipients],
  );

  const refetchQueries = [
    { query: StaffNotificationRecipientsDocument, variables: { canManageStaff } },
  ];

  const [createRecipient, createOpts] = useStaffNotificationRecipientCreateMutation({
    refetchQueries,
    awaitRefetchQueries: true,
    disableErrorHandling: true,
  });
  const [deleteRecipient, deleteOpts] = useStaffNotificationRecipientDeleteMutation({
    refetchQueries,
    awaitRefetchQueries: true,
    disableErrorHandling: true,
  });

  const mutating = createOpts.loading || deleteOpts.loading;

  const handleAssign = useCallback(
    async (members: Array<AssignableStaffMember | null | undefined>) => {
      const assignedIds = assignedStaffUserIds(recipients);
      const uniqueMembers = members.filter(
        (member): member is AssignableStaffMember => !!member && !assignedIds.has(member.id),
      );
      const inactiveMembers = uniqueMembers.filter(member => !member.isActive);
      const activeMembers = uniqueMembers.filter(member => member.isActive);

      if (inactiveMembers.length > 0) {
        notify({
          status: "warning",
          title: intl.formatMessage(notificationsMessages.skippedInactiveStaff),
        });
      }

      if (activeMembers.length === 0) {
        return;
      }

      const results = await Promise.all(
        activeMembers.map(async member => {
          try {
            const result = await createRecipient({
              variables: { input: { user: member.id, active: true } },
            });

            return (
              result.data?.staffNotificationRecipientCreate?.errors ?? [{ code: "GRAPHQL_ERROR" }]
            );
          } catch {
            return [{ code: "GRAPHQL_ERROR" }];
          }
        }),
      );

      const failed = results.filter(errors => errors.length > 0);
      const succeeded = results.length - failed.length;

      if (failed.length === 0) {
        notify({
          status: "success",
          title: intl.formatMessage(
            activeMembers.length === 1
              ? notificationsMessages.recipientAdded
              : notificationsMessages.recipientsAdded,
          ),
        });

        return;
      }

      if (succeeded > 0) {
        notify({
          status: "warning",
          title: intl.formatMessage(notificationsMessages.someRecipientsFailed),
        });

        return;
      }

      if (failed.some(isDuplicateRecipientError)) {
        notify({
          status: "error",
          title: intl.formatMessage(notificationsMessages.recipientAlreadyExists),
        });

        return;
      }

      notify({
        status: "error",
        title: intl.formatMessage(notificationsMessages.couldNotAddRecipient),
      });
    },
    [createRecipient, intl, notify, recipients],
  );

  const handleRemove = useCallback(
    async (id: string) => {
      try {
        const result = await deleteRecipient({
          variables: { id: toStaffNotificationRecipientGraphqlId(id) },
        });
        const errors = result.data?.staffNotificationRecipientDelete?.errors ?? [
          { code: "GRAPHQL_ERROR" },
        ];

        if (errors.length === 0) {
          notify({
            status: "success",
            title: intl.formatMessage(notificationsMessages.recipientRemoved),
          });

          return;
        }

        notify({
          status: "error",
          title: intl.formatMessage(notificationsMessages.couldNotRemoveRecipient),
        });
      } catch {
        notify({
          status: "error",
          title: intl.formatMessage(notificationsMessages.couldNotRemoveRecipient),
        });
      }
    },
    [deleteRecipient, intl, notify],
  );

  return {
    canManageSettings,
    canManageStaff,
    recipients,
    loading: canManageSettings && loading,
    mutating,
    onAssign: handleAssign,
    onRemove: handleRemove,
  };
};
