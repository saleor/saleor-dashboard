import { TopNav } from "@dashboard/components/AppLayout";
import { DashboardCard } from "@dashboard/components/Card";
import { ListPageLayout } from "@dashboard/components/Layouts";
import { useGlobalSearchQuery } from "@dashboard/graphql";
import { sectionNames } from "@dashboard/intl";
import { Box, ChevronRightIcon, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { WindowTitle } from "../components/WindowTitle";
import { SearchForm } from "./form";
import { ResultsTable } from "./resultsTable/ResultsTable";
import { useSearchCriteria } from "./useSearchCriteria";

const Component = () => {
  const intl = useIntl();
  const { query, scope } = useSearchCriteria();
  const { data } = useGlobalSearchQuery({
    variables: {
      query: "t-shirt",
    },
  });

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.search)} />
      <ListPageLayout>
        <TopNav
          withoutBorder
          isAlignToRight={false}
          title={intl.formatMessage(sectionNames.allSearchResults)}
        >
          <Box __flex={1} display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex">
              <Box marginX={3} display="flex" alignItems="center">
                <ChevronRightIcon />
              </Box>
              <Text size={6}>{scope}</Text>
            </Box>
          </Box>
        </TopNav>
        <DashboardCard>
          <SearchForm />
          <ResultsTable data={data} />
        </DashboardCard>
      </ListPageLayout>
    </>
  );
};

export default Component;
