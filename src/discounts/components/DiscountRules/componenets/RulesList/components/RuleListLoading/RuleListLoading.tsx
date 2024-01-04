import { Box, Skeleton } from "@saleor/macaw-ui-next";
import React from "react";

import { RuleListContainer } from "../RuleListContainer";
import { RuleWrapper } from "../RuleWrapper";

export const RuleListLoading = () => {
  return (
    <RuleListContainer>
      {[...Array(3)].map((_, index) => (
        <RuleWrapper hasError={false} key={index}>
          <Box display="flex" flexDirection="column" gap={3}>
            <Box __width="25%" paddingY={1} marginTop={1}>
              <Skeleton />
            </Box>
            <Box paddingY={0.5}>
              <Skeleton />
            </Box>
            <Box paddingY={0.5}>
              <Skeleton />
            </Box>
          </Box>
        </RuleWrapper>
      ))}
    </RuleListContainer>
  );
};
