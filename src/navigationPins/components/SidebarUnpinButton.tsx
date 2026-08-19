import ActionDialog from "@dashboard/components/ActionDialog";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { commonMessages } from "@dashboard/intl";
import { Box, Button } from "@saleor/macaw-ui-next";
import { PinOff } from "lucide-react";
import { type MouseEvent, useState } from "react";
import { useIntl } from "react-intl";

import { useNavigationPins } from "../hooks/useNavigationPins";
import { navigationPinMessages as messages } from "../messages";
import { removePinsById } from "../serialization";
import styles from "./SidebarUnpinButton.module.css";

interface SidebarUnpinButtonProps {
  /** `PageType.id` of the pinned model type. */
  pinId: string;
  pinName: string;
}

/** Removes the viewer's own pin straight from the sidebar row. */
export const SidebarUnpinButton = ({ pinId, pinName }: SidebarUnpinButtonProps) => {
  const intl = useIntl();
  const notify = useNotifier();
  const { userPins, setUserPins } = useNavigationPins();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleClick = (event: MouseEvent) => {
    // The row is a link — unpinning must not navigate.
    event.preventDefault();
    event.stopPropagation();
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    setSubmitting(true);

    try {
      await setUserPins(removePinsById(userPins, pinId));
      notify({ status: "success", text: intl.formatMessage(messages.unpinnedSuccess) });
      // The row unmounts with the pin, so there is nothing left to close.
    } catch {
      notify({ status: "error", text: intl.formatMessage(commonMessages.somethingWentWrong) });
      setSubmitting(false);
      setConfirmOpen(false);
    }
  };

  return (
    <>
      <Box className={styles.wrapper}>
        <Button
          variant="tertiary"
          size="small"
          icon={<PinOff size={14} />}
          onClick={handleClick}
          aria-label={intl.formatMessage(messages.unpin)}
          data-test-id="sidebar-unpin-button"
        />
      </Box>
      {/* Outside the wrapper — the dialog must not inherit its hover-driven visibility. */}
      {confirmOpen && (
        <ActionDialog
          open
          onClose={() => setConfirmOpen(false)}
          onConfirm={handleConfirm}
          confirmButtonState={submitting ? "loading" : "default"}
          confirmButtonLabel={intl.formatMessage(messages.unpin)}
          title={intl.formatMessage(messages.unpinConfirmTitle)}
        >
          {intl.formatMessage(messages.unpinConfirmDescription, { name: pinName })}
        </ActionDialog>
      )}
    </>
  );
};
