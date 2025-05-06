import Link from "@dashboard/components/Link";
import { buttonLabels } from "@dashboard/extensions/messages";
import { ExtensionsUrls } from "@dashboard/extensions/urls";
import { Button } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

interface ViewPluginDetailsProps {
  id: string;
}

export const ViewPluginDetails = ({ id }: ViewPluginDetailsProps) => {
  return (
    <Link href={ExtensionsUrls.resolveEditPluginExtensionUrl(id)}>
      <Button size="small" variant="secondary">
        <FormattedMessage {...buttonLabels.viewDetails} />
      </Button>
    </Link>
  );
};
