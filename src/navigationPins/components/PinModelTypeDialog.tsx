import { useUser } from "@dashboard/auth/useUser";
import BackButton from "@dashboard/components/BackButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { PermissionEnum } from "@dashboard/graphql";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { commonMessages } from "@dashboard/intl";
import { Box, Button, Select, Text } from "@saleor/macaw-ui-next";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";

import { FAVORITES_TARGET_ID, MAX_PINS_PER_TARGET } from "../constants";
import { useAvailablePinTargets } from "../hooks/useAvailablePinTargets";
import { useNavigationPins } from "../hooks/useNavigationPins";
import { navigationPinMessages as messages } from "../messages";
import { addPin, isTargetFull } from "../serialization";
import { type PinScope } from "../types";

interface PinModelTypeDialogProps {
  open: boolean;
  onClose: () => void;
  modelTypeId: string;
  modelTypeName: string;
}

export const PinModelTypeDialog = ({
  open,
  onClose,
  modelTypeId,
  modelTypeName,
}: PinModelTypeDialogProps) => {
  const intl = useIntl();
  const notify = useNotifier();
  const { user } = useUser();
  const { userPins, organizationPins, setUserPins, setOrganizationPins } = useNavigationPins();

  const canManageOrganizationPins = Boolean(
    user?.userPermissions?.some(permission => permission.code === PermissionEnum.MANAGE_SETTINGS),
  );

  const [scope, setScope] = useState<PinScope>("user");
  const [target, setTarget] = useState(FAVORITES_TARGET_ID);
  const [submitting, setSubmitting] = useState(false);

  const targets = useAvailablePinTargets(scope);

  // Favorites is user-only, so switching to organization scope has to move off it.
  useEffect(() => {
    if (!targets.some(available => available.id === target)) {
      setTarget(targets[0]?.id ?? FAVORITES_TARGET_ID);
    }
  }, [targets, target]);

  const currentPins = scope === "user" ? userPins : organizationPins;
  const full = isTargetFull(currentPins, target);

  const handleConfirm = async () => {
    setSubmitting(true);

    try {
      const next = addPin(currentPins, { id: modelTypeId, target });

      if (scope === "user") {
        await setUserPins(next);
      } else {
        await setOrganizationPins(next);
      }

      notify({ status: "success", text: intl.formatMessage(messages.pinnedSuccess) });
      onClose();
    } catch {
      notify({ status: "error", text: intl.formatMessage(commonMessages.somethingWentWrong) });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardModal open={open} onChange={onClose}>
      <DashboardModal.Content size="sm">
        <DashboardModal.Header>{intl.formatMessage(messages.pinDialogTitle)}</DashboardModal.Header>
        <DashboardModal.Body>
          <DashboardModal.Inset>
            <Box display="flex" flexDirection="column" gap={4}>
              <Text size={3} color="default2">
                {intl.formatMessage(messages.pinDialogDescription, { name: modelTypeName })}
              </Text>
              {canManageOrganizationPins && (
                <Select
                  label={intl.formatMessage(messages.scopeLabel)}
                  name="navigation-pin-scope"
                  value={scope}
                  onChange={value => setScope(value as PinScope)}
                  options={[
                    { label: intl.formatMessage(messages.scopeUser), value: "user" },
                    {
                      label: intl.formatMessage(messages.scopeOrganization),
                      value: "organization",
                    },
                  ]}
                />
              )}
              <Select
                label={intl.formatMessage(messages.targetLabel)}
                name="navigation-pin-target"
                value={target}
                onChange={value => setTarget(String(value))}
                options={targets.map(available => ({
                  label: intl.formatMessage(available.label),
                  value: available.id,
                }))}
              />
              {full && (
                <Text size={2} color="critical1">
                  {intl.formatMessage(messages.targetFull, { max: MAX_PINS_PER_TARGET })}
                </Text>
              )}
            </Box>
          </DashboardModal.Inset>
        </DashboardModal.Body>
        <DashboardModal.Actions>
          <BackButton onClick={onClose} />
          <Button
            variant="primary"
            disabled={full || submitting}
            onClick={handleConfirm}
            data-test-id="confirm-pin-model-type"
          >
            {intl.formatMessage(messages.pin)}
          </Button>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};
