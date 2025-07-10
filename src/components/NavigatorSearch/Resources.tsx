import { useNavigatorSearchQuery } from "@dashboard/graphql";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

export const Resources = ({ query }: { query: string }) => {
  const { data, loading } = useNavigatorSearchQuery({
    variables: {
      query,
    },
  });

  console.log(data);

  return (
    <Box marginTop={3}>
      <Text
        fontWeight="medium"
        size={2}
        color="default2"
        paddingX={4}
      >
        <FormattedMessage id="quick search" defaultMessage="Quick search" />
      </Text>
    </Box>
  );
};