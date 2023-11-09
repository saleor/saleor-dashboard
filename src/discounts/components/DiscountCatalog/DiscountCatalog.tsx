import { DashboardCard } from "@dashboard/components/Card";
import { Box } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { AddButton } from "./componenets/AddButton";
import { Rule } from "./componenets/Rule";
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
      <DashboardCard.Content>
        <Box display="flex" flexDirection="column" gap={6}>
          <Rule rule={{ name: "test1", id: "2", description: "" }} />
          <Rule rule={{ name: "test1", id: "2", description: "" }} />
        </Box>
      </DashboardCard.Content>
    </DashboardCard>
  );
};
