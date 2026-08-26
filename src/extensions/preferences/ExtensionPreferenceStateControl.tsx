import { Box, Button } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { extensionPreferencesMessages as m } from "./messages";
import { type ResolvedPreferenceState } from "./types";

interface ExtensionPreferenceStateControlProps {
  value: ResolvedPreferenceState;
  disabled: boolean;
  onChange: (next: ResolvedPreferenceState) => void;
}

const OPTIONS: ResolvedPreferenceState[] = ["default", "pinned", "hidden"];

export const ExtensionPreferenceStateControl = ({
  value,
  disabled,
  onChange,
}: ExtensionPreferenceStateControlProps) => {
  const intl = useIntl();

  const labels: Record<ResolvedPreferenceState, string> = {
    default: intl.formatMessage(m.stateDefault),
    pinned: intl.formatMessage(m.statePinned),
    hidden: intl.formatMessage(m.stateHidden),
  };

  return (
    <Box display="flex" gap={1}>
      {OPTIONS.map(option => (
        <Button
          key={option}
          type="button"
          size="small"
          disabled={disabled}
          variant={value === option ? "primary" : "secondary"}
          data-test-id={`extension-state-${option}`}
          onClick={() => onChange(option)}
        >
          {labels[option]}
        </Button>
      ))}
    </Box>
  );
};
