import { getStringOrPlaceholder } from "@dashboard/misc";
import React from "react";
import { FormattedMessage } from "react-intl";

import msgs from "./messages";

export interface AppDeactivateDialogContentProps {
  name?: string | null;
  thirdParty: boolean;
}

const AppDeactivateDialogContent = ({
  name,
  thirdParty,
}: AppDeactivateDialogContentProps) => {
  const getMainText = () => {
    const isNameMissing = name === null || name === "";

    if (isNameMissing) {
      return <FormattedMessage {...msgs.deactivateApp} />;
    }
    return (
      <FormattedMessage
        {...msgs.deactivateNamedApp}
        values={{
          name: <strong>{getStringOrPlaceholder(name)}</strong>,
        }}
      />
    );
  };

  return (
    <>
      {getMainText()}
      {thirdParty && (
        <>
          {" "}
          <FormattedMessage {...msgs.deactivateAppBillingInfo} />
        </>
      )}
    </>
  );
};
AppDeactivateDialogContent.displayName = "AppDeactivateDialogContent";
export default AppDeactivateDialogContent;
