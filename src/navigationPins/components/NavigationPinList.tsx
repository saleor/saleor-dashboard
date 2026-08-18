import { Box, Button, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { getPinTarget } from "../constants";
import { usePinnedModelTypeNames } from "../hooks/usePinnedModelTypeNames";
import { navigationPinMessages as messages } from "../messages";
import { type NavigationPin } from "../types";

interface NavigationPinListProps {
  pins: NavigationPin[];
  emptyMessage: string;
  disabled?: boolean;
  onRemove: (pin: NavigationPin) => void;
}

/**
 * Unlike the sidebar, this list keeps rows whose model type no longer resolves — otherwise a
 * deleted type would occupy one of the three slots with no way to free it.
 */
export const NavigationPinList = ({
  pins,
  emptyMessage,
  disabled,
  onRemove,
}: NavigationPinListProps) => {
  const intl = useIntl();
  const names = usePinnedModelTypeNames(pins.map(pin => pin.id));

  if (pins.length === 0) {
    return (
      <Text size={3} color="default2">
        {emptyMessage}
      </Text>
    );
  }

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {pins.map(pin => {
        const target = getPinTarget(pin.target);

        return (
          <Box
            key={`${pin.target}:${pin.id}`}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap={4}
          >
            <Box display="flex" flexDirection="column">
              <Text size={3}>{names[pin.id] ?? pin.id}</Text>
              {target && (
                <Text size={2} color="default2">
                  {intl.formatMessage(target.label)}
                </Text>
              )}
            </Box>
            <Button
              variant="tertiary"
              disabled={disabled}
              onClick={() => onRemove(pin)}
              data-test-id="remove-navigation-pin"
            >
              {intl.formatMessage(messages.remove)}
            </Button>
          </Box>
        );
      })}
    </Box>
  );
};
