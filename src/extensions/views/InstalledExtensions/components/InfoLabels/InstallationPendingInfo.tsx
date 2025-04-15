import { infoMessages } from "@dashboard/extensions/messages";
import { CircularProgress } from "@material-ui/core";
import React from "react";
import { FormattedMessage } from "react-intl";

import { InfoLabelsContainer } from "../InfoLabels/InfoLabelsContainer";

export const InstallationPendingInfo = () => {
  return (
    <InfoLabelsContainer
      icon={<CircularProgress size={10} thickness={7} />}
      message={<FormattedMessage {...infoMessages.installationPending} />}
    />
  );
};
