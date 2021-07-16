import Container from "@saleor/components/Container";
import React from "react";

import GiftCardsListHeader from "./GiftCardsListHeader";
import GiftCardsListTable from "./GiftCardsListTable";

const GiftCardsList: React.FC = () => (
  <Container>
    <GiftCardsListHeader />
    <GiftCardsListTable />
  </Container>
);

export default GiftCardsList;
