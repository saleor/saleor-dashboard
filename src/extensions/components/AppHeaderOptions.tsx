import activateIcon from "@assets/images/activate-icon.svg";
import deleteIcon from "@assets/images/delete.svg";
import { ButtonWithTooltip } from "@dashboard/components/ButtonWithTooltip";
import { useHasManagedAppsPermission } from "@dashboard/hooks/useHasManagedAppsPermission";
import { buttonMessages } from "@dashboard/intl";
import { Box } from "@saleor/macaw-ui-next";
import { RefreshCw } from "lucide-react";
import SVG from "react-inlinesvg";
import { FormattedMessage, useIntl } from "react-intl";

interface HeaderOptionsProps {
  isActive: boolean;
  showReload?: boolean;
  onAppActivateOpen: () => void;
  onAppDeactivateOpen: () => void;
  onAppDeleteOpen: () => void;
  onAppReloadOpen?: () => void;
}

export const AppHeaderOptions = ({
  isActive,
  showReload = false,
  onAppActivateOpen,
  onAppDeactivateOpen,
  onAppDeleteOpen,
  onAppReloadOpen,
}: HeaderOptionsProps) => {
  const intl = useIntl();
  const { hasManagedAppsPermission } = useHasManagedAppsPermission();
  const tooltipContent = !hasManagedAppsPermission
    ? intl.formatMessage(buttonMessages.noPermission)
    : undefined;

  return (
    <Box paddingX={6} borderBottomStyle="solid" borderColor="default1" borderBottomWidth={1}>
      <Box display="flex" gap={1} paddingY={2}>
        <ButtonWithTooltip
          data-test-id="app-activate-button"
          variant="tertiary"
          tooltip={tooltipContent}
          disabled={!hasManagedAppsPermission}
          onClick={isActive ? onAppDeactivateOpen : onAppActivateOpen}
          display="flex"
          alignItems="center"
          gap={1}
        >
          <SVG src={activateIcon} width={18} height={18} />
          {isActive ? (
            <FormattedMessage {...buttonMessages.deactivate} />
          ) : (
            <FormattedMessage {...buttonMessages.activate} />
          )}
        </ButtonWithTooltip>

        {showReload && (
          <ButtonWithTooltip
            data-test-id="app-reload-button"
            variant="tertiary"
            tooltip={tooltipContent}
            disabled={!hasManagedAppsPermission}
            onClick={onAppReloadOpen}
            display="flex"
            alignItems="center"
            gap={1}
          >
            <RefreshCw size={16} />
            <FormattedMessage {...buttonMessages.reload} />
          </ButtonWithTooltip>
        )}

        <ButtonWithTooltip
          data-test-id="app-delete-button"
          variant="tertiary"
          tooltip={tooltipContent}
          disabled={!hasManagedAppsPermission}
          onClick={onAppDeleteOpen}
          display="flex"
          alignItems="center"
          gap={1}
        >
          <SVG src={deleteIcon} width={16} height={16} />
          <FormattedMessage {...buttonMessages.delete} />
        </ButtonWithTooltip>
      </Box>
    </Box>
  );
};
