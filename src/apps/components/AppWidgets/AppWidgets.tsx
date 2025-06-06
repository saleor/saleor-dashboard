import { DashboardCard } from "@dashboard/components/Card";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";

export const AppWidgets = () => {
  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>Apps</DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        <Box marginBottom={4}>
          <Text size="3" color="default2">
            Stripe
          </Text>
          <Box marginTop={2} __height={300} __backgroundColor="rgba(255,0,0,.1)">
            Stripe app frame
          </Box>
        </Box>
        <Box>
          <Text size="3" color="default2">
            Invoices
          </Text>
          <Box marginTop={2} __height={300} __backgroundColor="rgba(255,0,0,.1)">
            Invoices app frame
          </Box>
        </Box>
      </DashboardCard.Content>
    </DashboardCard>
  );
};
