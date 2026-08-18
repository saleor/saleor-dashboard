import BackButton from "@dashboard/components/BackButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { commonMessages } from "@dashboard/intl";
import { useState } from "react";
import { useIntl } from "react-intl";

import { useNavigationPins } from "../hooks/useNavigationPins";
import { navigationPinMessages as messages } from "../messages";
import { removePin } from "../serialization";
import { type NavigationPin } from "../types";
import { NavigationPinList } from "./NavigationPinList";

interface OrganizationPinsDialogProps {
  open: boolean;
  onClose: () => void;
}

/** Removal only — organization pins are created through the pin button's scope selector. */
export const OrganizationPinsDialog = ({ open, onClose }: OrganizationPinsDialogProps) => {
  const intl = useIntl();
  const notify = useNotifier();
  const { organizationPins, setOrganizationPins } = useNavigationPins();
  const [submitting, setSubmitting] = useState(false);

  const handleRemove = async (pin: NavigationPin) => {
    setSubmitting(true);

    try {
      await setOrganizationPins(removePin(organizationPins, pin));
      notify({ status: "success", text: intl.formatMessage(messages.unpinnedSuccess) });
    } catch {
      notify({ status: "error", text: intl.formatMessage(commonMessages.somethingWentWrong) });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardModal open={open} onChange={onClose}>
      <DashboardModal.Content size="sm">
        <DashboardModal.Header>
          {intl.formatMessage(messages.organizationPinsTitle)}
        </DashboardModal.Header>
        <DashboardModal.Body>
          <DashboardModal.Inset>
            <NavigationPinList
              pins={organizationPins}
              emptyMessage={intl.formatMessage(messages.organizationPinsEmpty)}
              disabled={submitting}
              onRemove={handleRemove}
            />
          </DashboardModal.Inset>
        </DashboardModal.Body>
        <DashboardModal.Actions>
          <BackButton onClick={onClose} />
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};
