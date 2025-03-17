import SearchInput from "@dashboard/components/AppLayout/ListFilters/components/SearchInput";
import { Box } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { ExploreExtensionsActions } from "../components/ExploreExtensionsActions";
import { ExtensionsHeader } from "../components/ExtensionsHeader";
import { ExtensionsList } from "../components/ExtensionsList";
import { useExploreExtensions } from "../hooks/useExploreExtenstions";
import { headerTitles, messages } from "../messages";

export const ExploreExtensions = () => {
  const intl = useIntl();
  const extensions = useExploreExtensions();

  return (
    <Box paddingX={6}>
      <ExtensionsHeader
        title={intl.formatMessage(headerTitles.exploreExtensions)}
        actions={<ExploreExtensionsActions />}
      />

      <Box __width="370px" marginTop={3} marginBottom={12}>
        <SearchInput
          withBorder
          size="medium"
          initialSearch={""}
          placeholder={intl.formatMessage(messages.searchPlaceholder)}
          onSearchChange={() => {
            // TODO: Implement search logic
            // eslint-disable-next-line no-console
            console.log("On search change");
          }}
        />
      </Box>

      <ExtensionsList extensions={extensions} />
    </Box>
  );
};
