import React from "react";

import GiftCardListPage from "./GiftCardListPage";
import GiftCardListDialogsProvider from "./providers/GiftCardListDialogsProvider";
import { GiftCardsListProvider } from "./providers/GiftCardListProvider";
import { GiftCardListUrlQueryParams } from "./types";

interface GiftCardsListProps {
  params: GiftCardListUrlQueryParams;
}

const GiftCardsList: React.FC<GiftCardsListProps> = ({ params }) => (
  <GiftCardListDialogsProvider params={params}>
    <GiftCardsListProvider params={params}>
      <GiftCardListPage />
    </GiftCardsListProvider>
  </GiftCardListDialogsProvider>
);

export default GiftCardsList;
