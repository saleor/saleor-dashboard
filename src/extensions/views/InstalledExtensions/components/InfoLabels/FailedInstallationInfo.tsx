import { infoMessages } from "@dashboard/extensions/messages";
import { ErrorCircle } from "@dashboard/icons/ErrorCircle";
import React from "react";
import { FormattedMessage } from "react-intl";

import { InfoLabelsContainer } from "./InfoLabelsContainer";

export const FailedInstallationInfo = () => {
  return (
    <InfoLabelsContainer
      icon={<ErrorCircle />}
      message={<FormattedMessage {...infoMessages.installationFailed} />}
    />
  );
};
