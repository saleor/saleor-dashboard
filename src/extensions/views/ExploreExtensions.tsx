import { headerTitles } from "@dashboard/extensions/messages";
import { Box } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { ExploreExtensionsActions } from "../components/ExploreExtensionsActions";
import { ExtensionsHeader } from "../components/ExtensionsHeader";

export const ExploreExtensions = () => {
  const intl = useIntl();

  return (
    <Box>
      <ExtensionsHeader
        title={intl.formatMessage(headerTitles.exploreExtensions)}
        actions={<ExploreExtensionsActions />}
      />
    </Box>
  );
};
