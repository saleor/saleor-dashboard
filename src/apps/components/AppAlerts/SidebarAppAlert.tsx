import { AppSections } from "@dashboard/apps/urls";
import { Text, Tooltip } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";

import { AlertExclamationIcon } from "./AlertExclamationIcon";

export const SidebarAppAlert = ({ hasNewFailedAttempts }: { hasNewFailedAttempts: boolean }) => {
  if (!hasNewFailedAttempts) {
    return null;
  }

  return (
    <Tooltip>
      <Tooltip.Trigger>
        <Link to={AppSections.appsSection} data-test-id="sidebar-app-alert-trigger">
          <AlertExclamationIcon />
        </Link>
      </Tooltip.Trigger>

      <Tooltip.Content align="start" side="bottom">
        <Text>
          <FormattedMessage
            defaultMessage="Issues found.{break}Review app alerts."
            id="4MIO2H"
            values={{
              break: <br />,
            }}
          />
        </Text>
      </Tooltip.Content>
    </Tooltip>
  );
};
