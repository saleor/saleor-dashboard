import { DashboardCard } from "@dashboard/components/Card";
import { Box } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { AddButton } from "./componenets/AddButton";
import { messages } from "./messages";

export const DiscountCatalog = () => {
  const intl = useIntl();

  return (
    <DashboardCard>
      <DashboardCard.Title>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {intl.formatMessage(messages.title)}
          <AddButton onCatalogClick={() => {}} />
        </Box>
      </DashboardCard.Title>
      <DashboardCard.Content>Test</DashboardCard.Content>
    </DashboardCard>
  );
};
