import { InfoLabelsContainer } from "@dashboard/extensions/components/InfoLabels/InfoLabelsContainer";
import { infoMessages } from "@dashboard/extensions/messages";
import { DisabledIcon } from "@dashboard/icons/Disabled";
import React from "react";
import { FormattedMessage } from "react-intl";

export const AppDisabledInfo = () => {
  return (
    <InfoLabelsContainer
      icon={<DisabledIcon />}
      message={<FormattedMessage {...infoMessages.appDisabled} />}
    />
  );
};
