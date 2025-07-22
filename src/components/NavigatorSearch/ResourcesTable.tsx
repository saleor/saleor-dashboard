import { GridTable } from "@dashboard/components/GridTable";
import { NavigatorSearchQuery } from "@dashboard/graphql";
import { prepareResults } from "@dashboard/search/resultsTable/prepareResults";
import { ResultItem } from "@dashboard/search/resultsTable/ResultItem";
import React from "react";

export const ResourcesTable = ({
  data,
  onResourceClick,
}: {
  data: NavigatorSearchQuery;
  onResourceClick: () => void;
}) => {
  const results = prepareResults(data);

  return (
    <GridTable>
      <GridTable.Colgroup>
        <GridTable.Col __width="105px" />
        <GridTable.Col />
        <GridTable.Col __width="160px" />
      </GridTable.Colgroup>
      <GridTable.Body>
        {results.map(result => (
          <ResultItem
            key={result.node.id}
            result={result}
            className="command-menu-item"
            onClick={onResourceClick}
          />
        ))}
      </GridTable.Body>
    </GridTable>
  );
};
