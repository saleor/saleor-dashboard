import React from "react";

import GiftCardListSearchAndFilters from "./GiftCardListSearchAndFilters";
import { GiftCardsListDatagrid } from "./GiftCardsListDatagrid";
import GiftCardsListHeader from "./GiftCardsListHeader";

const GiftCardsListPage: React.FC = () => (
  <>
    <GiftCardsListHeader />
    <GiftCardListSearchAndFilters />
    <GiftCardsListDatagrid />
  </>
);

export default GiftCardsListPage;
