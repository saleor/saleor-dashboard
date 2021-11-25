import Container from "@saleor/components/Container";
import React from "react";

import GiftCardsListHeader from "./GiftCardsListHeader";
import GiftCardsListOrderCard from "./GiftCardsListOrderCard/GiftCardsListOrderCard";
import GiftCardsListTable from "./GiftCardsListTable";

const GiftCardsListPage: React.FC = () => (
  <Container>
    <GiftCardsListHeader />
    <GiftCardsListTable />
    <GiftCardsListOrderCard />
  </Container>
);

export default GiftCardsListPage;
