import { GridTable } from "@dashboard/components/GridTable";
import { GlobalSearchQuery } from "@dashboard/graphql";
import React from "react";

import { prepareResults } from "./prepareResults";
import { ResultItem } from "./ResultItem";

interface ResultsTableProps {
  data: GlobalSearchQuery;
}

export const ResultsTable = ({ data }: ResultsTableProps) => {
  const results = prepareResults(data);

  return (
    <GridTable>
      <GridTable.Colgroup>
        <GridTable.Col __width="60px" />
        <GridTable.Col />
        <GridTable.Col __width="160px" />
      </GridTable.Colgroup>
      <GridTable.Body>
        {results.map(result => (
          <ResultItem key={result.node.id} result={result} />
        ))}
      </GridTable.Body>
    </GridTable>
  );
};
