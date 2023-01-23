import { getStringOrPlaceholder } from "@dashboard/misc";
import React from "react";
import { FormattedMessage } from "react-intl";

import msgs from "./messages";

export interface AppDeleteDialogContentProps {
  name?: string | null;
  type: "CUSTOM" | "EXTERNAL";
}

const AppDeleteDialogContent = ({
  name,
  type,
}: AppDeleteDialogContentProps) => {
  const getMainText = () => {
    const isNameMissing = name === null || name === "";
    const isExternal = type === "EXTERNAL";

    if (isNameMissing && isExternal) {
      return <FormattedMessage {...msgs.deleteApp} />;
    }
    if (isNameMissing) {
      return <FormattedMessage {...msgs.deleteLocalApp} />;
    }
    if (isExternal) {
      return (
        <FormattedMessage
          {...msgs.deleteNamedApp}
          values={{
            name: <strong>{getStringOrPlaceholder(name)}</strong>,
          }}
        />
      );
    }
    return (
      <FormattedMessage
        {...msgs.deleteLocalNamedApp}
        values={{
          name: <strong>{getStringOrPlaceholder(name)}</strong>,
        }}
      />
    );
  };

  return (
    <>
      {getMainText()} <FormattedMessage {...msgs.deleteAppQuestion} />
    </>
  );
};
AppDeleteDialogContent.displayName = "AppDeleteDialogContent";
export default AppDeleteDialogContent;
