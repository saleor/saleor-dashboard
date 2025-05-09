import { AppSections } from "@dashboard/apps/urls";
import { Text, Tooltip } from "@saleor/macaw-ui-next";
import React from "react";
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
        <Link to={AppSections.appsSection} data-test-id="sidebar-app-alert-trigger">
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
