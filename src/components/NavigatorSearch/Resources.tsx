import Link from "@dashboard/components/Link";
import { useNavigatorSearchQuery } from "@dashboard/graphql";
import { ResultsTable } from "@dashboard/search/resultsTable/ResultsTable";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

export const Resources = ({
  query,
  onResourceClick,
}: {
  query: string;
  onResourceClick: () => void;
}) => {
  const { data } = useNavigatorSearchQuery({
    variables: {
      query,
    },
  });

  if (!data) {
    return null;
  }

  return (
    <Box marginTop={3}>
      <Text fontWeight="medium" size={2} color="default2" paddingX={6} display="block">
        <FormattedMessage id="49vo8t" defaultMessage="Quick search" />
      </Text>
      <Link href="/" data-href="/" className="command-menu-item" data-focus={false}>
        <Box
          display="flex"
          alignItems="center"
          color="default1"
          gap={2}
          backgroundColor={{
            hover: "default1Hovered",
          }}
          paddingY={1.5}
          paddingX={6}
          marginBottom={2}
        >
          <Text size={2} fontWeight="medium" color="default1">
            <FormattedMessage id="pdJlXC" defaultMessage="See all global search results" />
          </Text>
        </Box>
      </Link>
      <ResultsTable data={data} onItemClick={onResourceClick} />
    </Box>
  );
};
