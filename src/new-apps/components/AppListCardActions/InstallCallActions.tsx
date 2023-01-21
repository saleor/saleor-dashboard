import { buttonMessages } from "@dashboard/intl";
import { Button } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage } from "react-intl";

import { messages } from "./messages";

export interface InstallCallActionsProps {
  vercelDeploy?: () => void;
  install?: () => void;
}

const InstallCallActions = ({
  vercelDeploy,
  install,
}: InstallCallActionsProps) => {
  if (!vercelDeploy && !install) {
    return null;
  }

  return (
    <>
      {vercelDeploy && (
        <Button
          variant="secondary"
          onClick={vercelDeploy}
          data-test-id="app-deploy-to-vercel-button"
        >
          <FormattedMessage {...messages.deployToVercel} />
        </Button>
      )}
      {install && (
        <Button
          variant="primary"
          onClick={install}
          data-test-id="app-install-button"
        >
          <FormattedMessage {...buttonMessages.install} />
        </Button>
      )}
    </>
  );
};
InstallCallActions.displayName = "InstallCallActions";
export default InstallCallActions;
