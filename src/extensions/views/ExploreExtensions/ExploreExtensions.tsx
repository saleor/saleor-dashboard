import { TopNav } from "@dashboard/components/AppLayout";
import { useContextualLink } from "@dashboard/components/AppLayout/ContextualLinks/useContextualLink";
import SearchInput from "@dashboard/components/AppLayout/ListFilters/components/SearchInput";
import { DashboardCard } from "@dashboard/components/Card";
import { ListPageLayout } from "@dashboard/components/Layouts";
import { Box, Text } from "@saleor/macaw-ui-next";
import { Info } from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";

import { headerTitles, messages } from "../../messages";
import { ExploreExtensionsActions } from "./components/ExploreExtensionsActions";
import { ExtensionsList } from "./components/ExtensionsList/ExtensionsList";
import { useExploreExtensions } from "./hooks/useExploreExtensions";
import { useExtensionsFilter } from "./hooks/useExtenstionsFilter";

export const ExploreExtensions = () => {
  const intl = useIntl();
  const { extensions, loading, error, isFallback } = useExploreExtensions();
  const subtitle = useContextualLink("extensions");

  const { handleQueryChange, query, filteredExtensions } = useExtensionsFilter({ extensions });

  if (error) {
    // We want to show the default error page when app store api does not work
    throw new Error(error);
  }

  return (
    <ListPageLayout>
      <TopNav
        withoutBorder
        isAlignToRight={false}
        title={intl.formatMessage(headerTitles.extensions)}
        subtitle={subtitle}
      >
        <Box __flex={1} display="flex" justifyContent="space-between" alignItems="center">
          <Text size={6} fontWeight="regular">
            {intl.formatMessage(headerTitles.exploreExtensions)}
          </Text>
        </Box>
        <ExploreExtensionsActions />
      </TopNav>
      <DashboardCard paddingX={6}>
        {isFallback && (
          <Box
            display="flex"
            alignItems="center"
            backgroundColor="info1"
            padding={4}
            gap={2}
            borderRadius={3}
            marginBottom={4}
          >
            <Box flexShrink="0">
              <Info size={20} />
            </Box>
            <Text size={3}>
              <FormattedMessage {...messages.selfHostedBanner} />
            </Text>
          </Box>
        )}
        <Box __width="370px">
          <SearchInput
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
      </DashboardCard>
    </ListPageLayout>
  );
};
