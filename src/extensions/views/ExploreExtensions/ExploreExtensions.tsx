import { TopNav } from "@dashboard/components/AppLayout";
import SearchInput from "@dashboard/components/AppLayout/ListFilters/components/SearchInput";
import { Box } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { headerTitles, messages } from "../../messages";
import { ExploreExtensionsActions } from "./components/ExploreExtensionsActions";
import { ExtensionsList } from "./components/ExtensionsList";
import { useExploreExtensions } from "./hooks/useExploreExtensions";
import { useExtensionsFilter } from "./hooks/useExtenstionsFilter";

export const ExploreExtensions = () => {
  const intl = useIntl();
  const { extensions, loading, error } = useExploreExtensions();
  const { handleQueryChange, query, filteredExtensions } = useExtensionsFilter({ extensions });

  if (error) {
    // We want to show the default error page when app store api does not work
    throw new Error(error);
  }

  return (
    <>
      <TopNav title={intl.formatMessage(headerTitles.exploreExtensions)}>
        <ExploreExtensionsActions />
      </TopNav>
      <Box paddingX={6}>
        <Box __width="370px" marginTop={8} marginBottom={12}>
          <SearchInput
            withBorder
            size="medium"
            initialSearch={query}
            placeholder={intl.formatMessage(messages.searchPlaceholder)}
            onSearchChange={handleQueryChange}
          />
        </Box>

        <ExtensionsList
          extensions={filteredExtensions}
          loading={loading}
          clearSearch={() => handleQueryChange("")}
        />
      </Box>
    </>
  );
};
