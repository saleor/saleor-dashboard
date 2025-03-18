import CheckIcon from "@assets/images/check.svg";
import { SUCCESS_ICON_COLOR } from "@dashboard/colors";
import { Text } from "@saleor/macaw-ui-next";
import React from "react";
import SVG from "react-inlinesvg";
import { useIntl } from "react-intl";

import { messages } from "../../../messages";

export const InstalledBadge = () => {
  const intl = useIntl();

  return (
    <Text __color={SUCCESS_ICON_COLOR} display="flex" alignItems="center" fontSize={2} gap={1}>
      <SVG src={CheckIcon} />
      {intl.formatMessage(messages.installed)}
    </Text>
  );
};
