import { ButtonWithTooltip } from "@dashboard/components/ButtonWithTooltip";
import { useHasManagedAppsPermission } from "@dashboard/hooks/useHasManagedAppsPermission";
import { buttonMessages } from "@dashboard/intl";
import { Box } from "@saleor/macaw-ui-next";
import React from "react";
import SVG from "react-inlinesvg";
import { FormattedMessage, useIntl } from "react-intl";

import activateIcon from "../../../../assets/images/activate-icon.svg";
import deleteIcon from "../../../../assets/images/delete.svg";

interface HeaderOptionsProps {
  isActive: boolean;
  onAppActivateOpen: () => void;
  onAppDeactivateOpen: () => void;
  onAppDeleteOpen: () => void;
}

const HeaderOptions: React.FC<HeaderOptionsProps> = ({
  isActive,
  onAppActivateOpen,
  onAppDeactivateOpen,
  onAppDeleteOpen,
}) => {
  const intl = useIntl();
  const { hasManagedAppsPermission } = useHasManagedAppsPermission();

  const tooltipContent = !hasManagedAppsPermission
    ? intl.formatMessage(buttonMessages.noPermission)
    : undefined;

  return (
    <Box
      paddingX={6}
      borderBottomStyle="solid"
      borderColor="default1"
      borderBottomWidth={1}
    >
      <Box display="flex" gap={1} paddingY={2}>
        <ButtonWithTooltip
          variant="tertiary"
          tooltip={tooltipContent}
          disabled={!hasManagedAppsPermission}
          onClick={isActive ? onAppDeactivateOpen : onAppActivateOpen}
        >
          <Box marginRight={1}>
            <SVG src={activateIcon} />
          </Box>
          {isActive ? (
            <FormattedMessage {...buttonMessages.deactivate} />
          ) : (
            <FormattedMessage {...buttonMessages.activate} />
          )}
        </ButtonWithTooltip>

        <ButtonWithTooltip
          variant="tertiary"
          tooltip={tooltipContent}
          disabled={!hasManagedAppsPermission}
          onClick={onAppDeleteOpen}
        >
          <Box marginRight={1}>
            <SVG src={deleteIcon} />
          </Box>
          <FormattedMessage {...buttonMessages.delete} />
        </ButtonWithTooltip>
      </Box>
    </Box>
  );
};
export default HeaderOptions;
