import SearchInput from "@dashboard/components/AppLayout/ListFilters/components/SearchInput";
import { headerTitles, messages } from "@dashboard/extensions/messages";
import { Box } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { ExploreExtensionsActions } from "../components/ExploreExtensionsActions";
import { ExtensionsHeader } from "../components/ExtensionsHeader";

export const ExploreExtensions = () => {
  const intl = useIntl();

  return (
    <Box paddingX={6}>
      <ExtensionsHeader
        title={intl.formatMessage(headerTitles.exploreExtensions)}
        actions={<ExploreExtensionsActions />}
      />

      <Box __width="370px" marginTop={3} marginBottom={3}>
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
    </Box>
  );
};
