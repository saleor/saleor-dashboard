import { ExtensionsPaths } from "@dashboard/extensions/urls";
import { Text, Tooltip } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";

import { AlertExclamationIcon } from "./AlertExclamationIcon";

export const SidebarAppAlert = ({
  hasNewFailedAttempts,
  small,
}: {
  hasNewFailedAttempts: boolean;
  small?: boolean;
}) => {
  if (!hasNewFailedAttempts) {
    return null;
  }

  return (
    <Tooltip>
      <Tooltip.Trigger>
        <Link to={ExtensionsPaths.installedExtensions} data-test-id="sidebar-app-alert-trigger">
          <AlertExclamationIcon width={small ? 15 : 17} height={small ? 15 : 17} />
        </Link>
      </Tooltip.Trigger>

      <Tooltip.Content align="start" side="bottom">
        <Text>
          <FormattedMessage
            defaultMessage="Issues found.{break}Review extension alerts."
            id="g9M3PH"
            values={{
              break: <br />,
            }}
          />
        </Text>
      </Tooltip.Content>
    </Tooltip>
  );
};
