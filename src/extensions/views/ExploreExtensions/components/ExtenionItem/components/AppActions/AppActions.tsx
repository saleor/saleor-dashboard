import { AppUrls } from "@dashboard/apps/urls";
import Link from "@dashboard/components/Link";
import { messages } from "@dashboard/extensions/messages";
import { Box, Button, ExternalLinkIcon } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { AppInstallButton } from "../AppInstallButton";

interface AppActionsProps {
  isInstalled: boolean;
  manifestUrl?: string | null;
  repositoryUrl?: string | null;
  id?: string;
  disabled?: boolean;
}

export const AppActions = ({
  isInstalled,
  repositoryUrl,
  manifestUrl,
  id,
  disabled,
}: AppActionsProps) => {
  const intl = useIntl();

  if (isInstalled && disabled && id) {
    return (
      <Link href={AppUrls.resolveAppDetailsUrl(id)}>
        <Button variant="secondary">{intl.formatMessage(messages.manageApp)}</Button>
      </Link>
    );
  }

  if (isInstalled && id) {
    return (
      <Link href={AppUrls.resolveAppUrl(id)}>
        <Button variant="secondary">{intl.formatMessage(messages.viewDetails)}</Button>
      </Link>
    );
  }

  return (
    <>
      {manifestUrl && <AppInstallButton manifestUrl={manifestUrl} />}
      {repositoryUrl && (
        <Link target="_blank" href={repositoryUrl}>
          <Button variant="secondary" display="flex" alignItems="center" gap={2}>
            {intl.formatMessage(messages.viewOnGithub)}
            <Box marginTop={1}>
              <ExternalLinkIcon size="small" />
            </Box>
          </Button>
        </Link>
      )}
    </>
  );
};
