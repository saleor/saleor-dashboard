<<<<<<< HEAD
import Container from "@saleor/components/Container";
import React from "react";

import GiftCardsListHeader from "./GiftCardsListHeader";
import { GiftCardsListProvider } from "./GiftCardsListProvider";
import GiftCardsListTable from "./GiftCardsListTable";
import { GiftCardListUrlQueryParams } from "./types";

interface GiftCardsListProps {
  params: GiftCardListUrlQueryParams;
}

const GiftCardsList: React.FC<GiftCardsListProps> = ({ params }) => {
  return (
    <GiftCardsListProvider params={params}>
      <Container>
        <GiftCardsListHeader />
        <GiftCardsListTable />
      </Container>
    </GiftCardsListProvider>
  );
};
=======
import React from "react";

const GiftCardsList: React.FC = () => null;
>>>>>>> Add gift cards section to menu and add empty list component

export default GiftCardsList;
