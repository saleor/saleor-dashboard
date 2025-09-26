import { useNavigatorSearchQuery } from "@dashboard/graphql";
import { ListSkeleton } from "@dashboard/search/resultsTable/ListSkeleton";
import { prepareResults } from "@dashboard/search/resultsTable/prepareResults";
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
  const { data } = useNavigatorSearchQuery({
    variables: {
      query,
    },
    onCompleted: onResourcesLoaded,
  });

  if (!data) {
    return <ListSkeleton />;
  }

  const results = prepareResults(data);

  if (results.empty) return null;

  return <ResultsTable data={results} onItemClick={onResourceClick} />;
};
