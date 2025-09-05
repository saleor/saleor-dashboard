import { messages } from "@dashboard/extensions/messages";
import { ExtensionsUrls } from "@dashboard/extensions/urls";
import { PermissionEnum } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { buttonMessages } from "@dashboard/intl";
import { useUserHasPermissions } from "@dashboard/utils/permissions";
import { Button, Tooltip } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

interface PluginActionsProps {
  isInstalled: boolean;
  id: string;
}

export const PluginActions = ({ isInstalled, id }: PluginActionsProps) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const canManagePlugins = useUserHasPermissions([PermissionEnum.MANAGE_PLUGINS]);

  const openPlugin = () => {
    navigate(ExtensionsUrls.resolveEditPluginExtensionUrl(id));
  };

  return (
    <Tooltip open={canManagePlugins ? false : undefined}>
      <Tooltip.Trigger>
        <Button
          disabled={!canManagePlugins}
          variant="secondary"
          onClick={openPlugin}
          data-test-id={"plugin-install-button"}
        >
          {isInstalled
            ? intl.formatMessage(messages.viewDetails)
            : intl.formatMessage(messages.install)}
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content>
        <Tooltip.Arrow />
        <FormattedMessage {...buttonMessages.noPermission} />
      </Tooltip.Content>
    </Tooltip>
  );
};
