import { useNavigatorSearchQuery } from "@dashboard/graphql";
import { ListSkeleton } from "@dashboard/search/resultsTable/ListSkeleton";
import { prepareResults } from "@dashboard/search/resultsTable/prepareResults";
import { ResultsAsListboxOptionsContext } from "@dashboard/search/resultsTable/ResultsAsListboxOptionsContext";
import { ResultsTable } from "@dashboard/search/resultsTable/ResultsTable";

export const ResourcesTable = ({
  query,
  onResourceClick,
  onResourcesLoaded,
}: {
  query: string;
  onResourceClick: () => void;
  onResourcesLoaded: () => void;
}) => {
  const { data, loading } = useNavigatorSearchQuery({
    variables: {
      query,
    },
    onCompleted: onResourcesLoaded,
  });

  if (loading || !data) {
    return <ListSkeleton />;
  }

  const results = prepareResults(data);

  if (results.empty) return null;

  return (
    // These rows live inside the Navigator's listbox, so they are options.
    <ResultsAsListboxOptionsContext.Provider value={true}>
      <ResultsTable data={results} onItemClick={onResourceClick} />
    </ResultsAsListboxOptionsContext.Provider>
  );
};
