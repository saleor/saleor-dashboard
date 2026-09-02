import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Box, Button } from "@saleor/macaw-ui-next";
import { Eye, EyeOff, Pin } from "lucide-react";
import { useIntl } from "react-intl";

import { extensionPreferencesMessages as m } from "./messages";
import { type ResolvedPreferenceState } from "./types";
import {
  isWidgetPinned,
  isWidgetShown,
  setWidgetShown,
  toggleWidgetPinned,
} from "./widgetPreferenceState";

interface ExtensionPreferenceStateControlProps {
  value: ResolvedPreferenceState;
  disabled: boolean;
  onChange: (next: ResolvedPreferenceState) => void;
}

export const ExtensionPreferenceStateControl = ({
  value,
  disabled,
  onChange,
}: ExtensionPreferenceStateControlProps): JSX.Element => {
  const intl = useIntl();
  const shown = isWidgetShown(value);
  const pinned = isWidgetPinned(value);

  return (
    <Box display="flex" alignItems="center" gap={1}>
      {shown ? (
        <Button
          type="button"
          variant="tertiary"
          size="small"
          disabled={disabled}
          data-test-id="extension-pin"
          aria-pressed={pinned}
          onClick={() => onChange(toggleWidgetPinned(value))}
          icon={
            <Pin
              size={iconSize.small}
              strokeWidth={iconStrokeWidthBySize.small}
              fill={pinned ? "currentColor" : "none"}
            />
          }
        >
          {intl.formatMessage(pinned ? m.pinnedLabel : m.pinLabel)}
        </Button>
      ) : null}
      <Button
        type="button"
        variant="tertiary"
        size="small"
        disabled={disabled}
        data-test-id="extension-widget-visible"
        aria-pressed={shown}
        onClick={() => onChange(setWidgetShown(value, !shown))}
        icon={
          shown ? (
            <Eye size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
          ) : (
            <EyeOff size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
          )
        }
      >
        {intl.formatMessage(shown ? m.visibleLabel : m.hiddenLabel)}
      </Button>
    </Box>
  );
};
