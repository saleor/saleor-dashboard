import Link from "@dashboard/components/Link";
import { Box, Button, ExternalLinkIcon } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { messages } from "../../../messages";

interface AppActionsProps {
  isInstalled: boolean;
  manifestUrl?: string | null;
  repositoryUrl?: string | null;
  id: string;
}

export const AppActions = ({ isInstalled, repositoryUrl, manifestUrl }: AppActionsProps) => {
  const intl = useIntl();

  if (isInstalled) {
    return (
      <Link href="/extensions/{id}">
        <Button variant="secondary">{intl.formatMessage(messages.viewDetails)}</Button>
      </Link>
    );
  }

  return (
    <>
      {manifestUrl && (
        <Link href="/extensions/plugin/{id}/install">
          <Button variant="secondary">{intl.formatMessage(messages.install)}</Button>
        </Link>
      )}
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
