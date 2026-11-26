import { Menu, type TopNavMenuItem } from "@dashboard/components/AppLayout/TopNav/Menu";
import { topNavMessages } from "@dashboard/components/AppLayout/TopNav/messages";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { useHasManagedAppsPermission } from "@dashboard/hooks/useHasManagedAppsPermission";
import { buttonMessages, commonStatusMessages } from "@dashboard/intl";
import { Box, Button, Text, Tooltip } from "@saleor/macaw-ui-next";
import { Ellipsis, Power, Trash2 } from "lucide-react";
import { useIntl } from "react-intl";

interface AppActionsMenuProps {
  isActive: boolean;
  onAppActivateOpen: () => void;
  onAppDeactivateOpen: () => void;
  onAppDeleteOpen: () => void;
}

const iconProps = { size: iconSize.small, strokeWidth: iconStrokeWidthBySize.small } as const;

export const AppActionsMenu = ({
  isActive,
  onAppActivateOpen,
  onAppDeactivateOpen,
  onAppDeleteOpen,
}: AppActionsMenuProps) => {
  const intl = useIntl();
  const { hasManagedAppsPermission } = useHasManagedAppsPermission();
  const moreActionsLabel = intl.formatMessage(topNavMessages.moreActions);

  const items: TopNavMenuItem[] = [
    {
      label: intl.formatMessage(isActive ? buttonMessages.deactivate : buttonMessages.activate),
      testId: "app-activate-button",
      color: isActive ? "warning1" : undefined,
      icon: <Power {...iconProps} />,
      onSelect: isActive ? onAppDeactivateOpen : onAppActivateOpen,
    },
    {
      label: intl.formatMessage(buttonMessages.delete),
      testId: "app-delete-button",
      color: "critical1",
      icon: <Trash2 {...iconProps} />,
      onSelect: onAppDeleteOpen,
    },
  ];

  const trigger = (
    <Button
      icon={<Ellipsis {...iconProps} />}
      variant="secondary"
      type="button"
      size="small"
      data-test-id="app-actions-menu-button"
      aria-label={moreActionsLabel}
      title={hasManagedAppsPermission ? moreActionsLabel : undefined}
      disabled={!hasManagedAppsPermission}
    />
  );

  return (
    <Box display="flex" alignItems="center" gap={3}>
      <Box display="flex" alignItems="center" gap={1.5} data-test-id="app-status">
        <Box
          width={2}
          height={2}
          borderRadius="100%"
          backgroundColor={isActive ? "success1" : "default1Hovered"}
        />
        <Text size={2} color="default2">
          {intl.formatMessage(
            isActive ? commonStatusMessages.active : commonStatusMessages.notActive,
          )}
        </Text>
      </Box>
      {hasManagedAppsPermission ? (
        <Menu items={items} trigger={trigger} dataTestId="app-actions-menu" />
      ) : (
        <Tooltip>
          <Tooltip.Trigger>
            <Box>{trigger}</Box>
          </Tooltip.Trigger>
          <Tooltip.Content>
            <Tooltip.Arrow />
            {intl.formatMessage(buttonMessages.noPermission)}
          </Tooltip.Content>
        </Tooltip>
      )}
    </Box>
  );
};
