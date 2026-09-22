import { Box, Button } from "@saleor/macaw-ui-next";
import { EyeOff, Pin } from "lucide-react";
import { useIntl } from "react-intl";

import { extensionPreferencesMessages as m } from "./messages";
import { type PreferenceKeyInput } from "./types";
import { useExtensionPreferences } from "./useExtensionPreferences";

interface InlineExtensionPreferenceControlsProps {
  extension: PreferenceKeyInput & { label: string };
}

export const InlineExtensionPreferenceControls = ({
  extension,
}: InlineExtensionPreferenceControlsProps) => {
  const intl = useIntl();
  const { getState, setState, isSaving } = useExtensionPreferences();
  const state = getState(extension);
  const isPinned = state === "pinned";

  return (
    <Box display="flex" gap={1} alignItems="center">
      <Button
        type="button"
        variant="tertiary"
        size="small"
        disabled={isSaving}
        data-test-id="extension-pin"
        title={intl.formatMessage(isPinned ? m.unpin : m.pin)}
        onClick={() => setState(extension, isPinned ? "default" : "pinned")}
        icon={<Pin size={16} fill={isPinned ? "currentColor" : "none"} />}
      />
      <Button
        type="button"
        variant="tertiary"
        size="small"
        disabled={isSaving}
        data-test-id="extension-hide"
        title={intl.formatMessage(m.hide)}
        onClick={() => setState(extension, "hidden")}
        icon={<EyeOff size={16} />}
      />
    </Box>
  );
};
