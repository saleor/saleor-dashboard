import { GridTable } from "@dashboard/components/GridTable";
import { GlobalSearchQuery } from "@dashboard/graphql";
import { Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { prepareResults } from "./prepareResults";
import { ResultItem } from "./ResultItem";

interface ResultsTableProps {
  data: GlobalSearchQuery;
}

export const ResultsTable = ({ data }: ResultsTableProps) => {
  const results = prepareResults(data);

  if (results.length === 0) {
    return (
      <Text textAlign="center" paddingTop={32} color="default2" fontSize={4} fontWeight="medium">
        <FormattedMessage id="hX5PAb" defaultMessage="No results found" />
      </Text>
    );
  }

  return (
    <GridTable>
      <GridTable.Colgroup>
        <GridTable.Col __width="105px" />
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
