import React from "react";

import GiftCardListSearchAndFilters from "./GiftCardListSearchAndFilters";
import { GiftCardsListDatagrid } from "./GiftCardsListDatagrid";
import GiftCardsListHeader from "./GiftCardsListHeader";
import GiftCardsListOrderInfoCard from "./GiftCardsListOrderInfoCard/GiftCardsListOrderInfoCard";

const GiftCardsListPage: React.FC = () => (
  <>
    <GiftCardsListHeader />
    <GiftCardListSearchAndFilters />
    <GiftCardsListDatagrid />
    <GiftCardsListOrderInfoCard />
  </>
);

export default GiftCardsListPage;
