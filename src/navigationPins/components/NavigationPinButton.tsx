import { useNotifier } from "@dashboard/hooks/useNotifier";
import { commonMessages } from "@dashboard/intl";
import { Ripple } from "@dashboard/ripples/components/Ripple";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import { Pin, PinOff } from "lucide-react";
import { useState } from "react";
import { useIntl } from "react-intl";

import { useNavigationPins } from "../hooks/useNavigationPins";
import { navigationPinMessages as messages } from "../messages";
import { rippleNavigationPins } from "../ripples/navigationPins";
import { isPinned, removePinsById } from "../serialization";
import { PinModelTypeDialog } from "./PinModelTypeDialog";

interface NavigationPinButtonProps {
  /** The single selected model type, or null on the "All models" and group tabs. */
  modelTypeId: string | null;
  modelTypeName: string | undefined;
}

/**
 * Reflects only the viewer's own pin. Organization pins are managed separately, so this
 * control never edits them — it just steps aside when one exists.
 */
export const NavigationPinButton = ({ modelTypeId, modelTypeName }: NavigationPinButtonProps) => {
  const intl = useIntl();
  const notify = useNotifier();
  const { userPins, organizationPins, setUserPins } = useNavigationPins();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // A pin is exactly one model type, so there is nothing to offer for "all" or group tabs.
  if (!modelTypeId) {
    return null;
  }

  if (isPinned(organizationPins, modelTypeId)) {
    return (
      <Text size={3} color="default2" data-test-id="pinned-by-organization">
        {intl.formatMessage(messages.pinnedByOrganization)}
      </Text>
    );
  }

  const pinnedByUser = isPinned(userPins, modelTypeId);

  const handleUnpin = async () => {
    setSubmitting(true);

    try {
      await setUserPins(removePinsById(userPins, modelTypeId));
      notify({ status: "success", text: intl.formatMessage(messages.unpinnedSuccess) });
    } catch {
      notify({ status: "error", text: intl.formatMessage(commonMessages.somethingWentWrong) });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box display="flex" alignItems="center" gap={2}>
      <Ripple model={rippleNavigationPins} />
      <Button
        variant="secondary"
        disabled={submitting}
        onClick={pinnedByUser ? handleUnpin : () => setDialogOpen(true)}
        icon={pinnedByUser ? <PinOff size={16} /> : <Pin size={16} />}
        data-test-id="navigation-pin-button"
      >
        {intl.formatMessage(pinnedByUser ? messages.unpinFromNav : messages.pinToNav)}
      </Button>
      {dialogOpen && (
        <PinModelTypeDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          modelTypeId={modelTypeId}
          modelTypeName={modelTypeName ?? ""}
        />
      )}
    </Box>
  );
};
