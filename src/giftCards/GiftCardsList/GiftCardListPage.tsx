import VerticalSpacer from "@dashboard/apps/components/VerticalSpacer";
import Container from "@dashboard/components/Container";
import React from "react";

import GiftCardsListHeader from "./GiftCardsListHeader";
import GiftCardsListOrderInfoCard from "./GiftCardsListOrderInfoCard/GiftCardsListOrderInfoCard";
import GiftCardsListTable from "./GiftCardsListTable";

const GiftCardsListPage: React.FC = () => (
  <Container>
    <GiftCardsListHeader />
    <GiftCardsListTable />
    <VerticalSpacer spacing={2} />
    <GiftCardsListOrderInfoCard />
  </Container>
);

export default GiftCardsListPage;
