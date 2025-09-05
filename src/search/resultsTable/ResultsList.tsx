import { GlobalSearchQuery } from "@dashboard/graphql";
import { Text } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

import { prepareResults } from "./prepareResults";
import { ResultsTable } from "./ResultsTable";

interface ResultsListProps {
  data: GlobalSearchQuery;
  onItemClick?: () => void;
}

export const ResultsList = ({ data, onItemClick }: ResultsListProps) => {
  const results = prepareResults(data);

  if (results.empty) {
    return (
      <Text textAlign="center" paddingTop={32} color="default2" fontSize={4} fontWeight="medium">
        <FormattedMessage id="hX5PAb" defaultMessage="No results found" />
      </Text>
    );
  }

  return <ResultsTable data={results} onItemClick={onItemClick} />;
};
