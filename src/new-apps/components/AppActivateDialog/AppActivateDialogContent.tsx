import { getStringOrPlaceholder } from "@dashboard/misc";
import React from "react";
import { FormattedMessage } from "react-intl";

import msgs from "./messages";

export interface AppActivateDialogContentProps {
  name?: string | null;
}

const AppActivateDialogContent = ({ name }: AppActivateDialogContentProps) => {
  const isNameMissing = name === null || name === "";

  if (isNameMissing) {
    return <FormattedMessage {...msgs.activateApp} />;
  }
  return (
    <FormattedMessage
      {...msgs.activateNamedApp}
      values={{
        name: <strong>{getStringOrPlaceholder(name)}</strong>,
      }}
    />
  );
};
AppActivateDialogContent.displayName = "AppActivateDialogContent";
export default AppActivateDialogContent;
