import Link from "@dashboard/components/Link";
import { Button } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { messages } from "../../../messages";

interface PluginActionsProps {
  isInstalled: boolean;
  id: string;
}

export const PluginActions = ({ isInstalled }: PluginActionsProps) => {
  const intl = useIntl();

  if (isInstalled) {
    return (
      <Link href="/extensions/install-plugin">
        <Button variant="secondary">{intl.formatMessage(messages.viewDetails)}</Button>
      </Link>
    );
  }

  return (
    <Link href="/extensions/plugin/{id}">
      <Button variant="secondary">{intl.formatMessage(messages.install)}</Button>
    </Link>
  );
};
