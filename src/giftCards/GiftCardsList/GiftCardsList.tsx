import Container from "@saleor/components/Container";
import React from "react";

import GiftCardsListHeader from "./GiftCardsListHeader";
import { GiftCardsListProvider } from "./GiftCardsListProvider";
import GiftCardsListTable from "./GiftCardsListTable";
import { GiftCardListUrlQueryParams } from "./types";

interface GiftCardsListProps {
  params: GiftCardListUrlQueryParams;
}

const GiftCardsList: React.FC<GiftCardsListProps> = ({ params }) => (
  <GiftCardsListProvider params={params}>
    <Container>
      <GiftCardsListHeader />
      <GiftCardsListTable />
    </Container>
  </GiftCardsListProvider>
);

export default GiftCardsList;
