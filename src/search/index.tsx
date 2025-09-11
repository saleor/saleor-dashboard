import { DashboardCard } from "@dashboard/components/Card";
import { ListPageLayout } from "@dashboard/components/Layouts";
import { useGlobalSearchQuery } from "@dashboard/graphql";
import { sectionNames } from "@dashboard/intl";
import { useEffect } from "react";
import { useIntl } from "react-intl";

import { WindowTitle } from "../components/WindowTitle";
import { SearchForm } from "./form";
import { ListSkeleton } from "./resultsTable/ListSkeleton";
import { ResultsList } from "./resultsTable/ResultsList";
import { SearchHistory } from "./SearchHistory";
import { useHistoryCriteria } from "./useHistoryCriteria";
import { useInclusionVariables } from "./useInclusionVariables";
import { useSearchCriteria } from "./useSearchCriteria";

const Component = () => {
  const intl = useIntl();
  const { query, scope, changeQuery, changeScope } = useSearchCriteria();
  const { history, addToHistory, clearHistory, clearItem } = useHistoryCriteria();
  const inclusionVariables = useInclusionVariables(scope);
  const { data, loading } = useGlobalSearchQuery({
    variables: {
      query,
      ...inclusionVariables,
    },
    skip: !query,
  });

  const displaySkeleton = loading && !data;
  const displayResults = query && data;
  const displayHistory = !query && !data;

  const handleSearchChange = (value: string) => {
    addToHistory(value);
    changeQuery(value);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        window.history.back();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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
          {displayResults && <ResultsList data={data} />}
          {displayHistory && (
            <SearchHistory
              history={history}
              onClearHistory={clearHistory}
              onItemClick={handleSearchChange}
              onClearItem={clearItem}
            />
          )}
        </DashboardCard>
      </ListPageLayout>
    </>
  );
};

export default Component;
