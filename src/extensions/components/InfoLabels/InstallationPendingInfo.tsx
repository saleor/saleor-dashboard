import { InfoLabelsContainer } from "@dashboard/extensions/components/InfoLabels/InfoLabelsContainer";
import { infoMessages } from "@dashboard/extensions/messages";
import { CircularProgress } from "@material-ui/core";
import React from "react";
import { FormattedMessage } from "react-intl";

export const InstallationPendingInfo = () => {
  return (
    <InfoLabelsContainer
      icon={<CircularProgress size={10} thickness={7} />}
      message={<FormattedMessage {...infoMessages.installationPending} />}
    />
  );
};
