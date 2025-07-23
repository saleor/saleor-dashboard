import { useNavigatorSearchQuery } from "@dashboard/graphql";
import { ResultsTable } from "@dashboard/search/resultsTable/ResultsTable";
import React from "react";

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
    return null;
  }

  return <ResultsTable data={data} onItemClick={onResourceClick} />;
};
