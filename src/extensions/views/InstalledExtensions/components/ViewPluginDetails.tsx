import Link from "@dashboard/components/Link";
import { buttonLabels } from "@dashboard/extensions/messages";
import { pluginPath } from "@dashboard/plugins/urls";
import { Button } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

interface ViewPluginDetailsProps {
  id: string;
}

export const ViewPluginDetails = ({ id }: ViewPluginDetailsProps) => {
  return (
    <Link href={pluginPath(id)}>
      <Button size="small" variant="secondary">
        <FormattedMessage {...buttonLabels.viewDetails} />
      </Button>
    </Link>
  );
};
