import { DashboardCard } from "@dashboard/components/Card";
import { ListPageLayout } from "@dashboard/components/Layouts";
import { useGlobalSearchQuery } from "@dashboard/graphql";
import { sectionNames } from "@dashboard/intl";
import React from "react";
import { useIntl } from "react-intl";

import { WindowTitle } from "../components/WindowTitle";
import { SearchForm } from "./form";
import { ListSkeleton } from "./resultsTable/ListSkeleton";
import { ResultsTable } from "./resultsTable/ResultsTable";
import { SearchHistory } from "./SearchHistory";
import { useHistoryCriteria } from "./useHistoryCriteria";
import { useSearchCriteria } from "./useSearchCriteria";

/*
- w kategoriach parenta dodac tak jak w produktach na edycji
- dopracowac design wynikow
- auto focus na input
- usunac breadcrumb
- historia wyszukiwania w LS (last 20)
- persisted wybor taba w LS, ale GET moze to overridowac, ale nie zapisac
- LS jest stanem tylko kiedy



- dowiedziec sie jak dziala wyszukiwanie, po jakich polach i na jakich zasadach

*/

const Component = () => {
  const intl = useIntl();
  const { query, scope, changeQuery, changeScope } = useSearchCriteria();
  const { history, addToHistory, clearHistory } = useHistoryCriteria();
  const { data, loading } = useGlobalSearchQuery({
    variables: { query },
    skip: !query,
  });

  const displaySkeleton = loading && !data;
  const displayResults = query && data;
  const displayHistory = !query && !data;

  const handleSearchChange = (value: string) => {
    addToHistory(value);
    changeQuery(value);
  };

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.search)} />
      <ListPageLayout>
        <DashboardCard paddingTop={5}>
          <SearchForm
            onSearchChange={handleSearchChange}
            onScopeChange={changeScope}
            scope={scope}
            query={query}
          />
          {displaySkeleton && <ListSkeleton />}
          {displayResults && <ResultsTable data={data} />}
          {displayHistory && (
            <SearchHistory
              history={history}
              onClearHistory={clearHistory}
              onItemClick={handleSearchChange}
            />
          )}
        </DashboardCard>
      </ListPageLayout>
    </>
  );
};

export default Component;
