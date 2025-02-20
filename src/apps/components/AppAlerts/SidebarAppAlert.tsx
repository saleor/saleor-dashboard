import { AppSections } from "@dashboard/apps/urls";
import { WARNING_ICON_COLOR, WARNING_ICON_COLOR_LIGHTER } from "@dashboard/colors";
import { ExclamationIcon } from "@dashboard/icons/ExclamationIcon";
import { ExclamationIconFilled } from "@dashboard/icons/ExclamationIconFilled";
import { Box, Text, Tooltip } from "@saleor/macaw-ui-next";
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";

import { useAppsAlert } from "./useAppsAlert";

const ExclamationIconComponent = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Box
      __color={isHovered ? WARNING_ICON_COLOR_LIGHTER : WARNING_ICON_COLOR}
      __width={17}
      __height={17}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered ? <ExclamationIconFilled /> : <ExclamationIcon />}
    </Box>
  );
};

export const SidebarAppAlert = () => {
  const { hasFailedAttempts } = useAppsAlert();

  if (!hasFailedAttempts) {
    return null;
  }

  return (
    <Tooltip>
      <Tooltip.Trigger>
        <Link to={AppSections.appsSection}>
          <ExclamationIconComponent />
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
