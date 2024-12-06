import GiftCardListSearchAndFilters from "./GiftCardListSearchAndFilters";
import { GiftCardsListDatagrid } from "./GiftCardsListDatagrid";
import GiftCardsListHeader from "./GiftCardsListHeader";
import GiftCardsListOrderInfoCard from "./GiftCardsListOrderInfoCard/GiftCardsListOrderInfoCard";

const GiftCardsListPage = () => (
  <>
    <GiftCardsListHeader />
    <GiftCardListSearchAndFilters />
    <GiftCardsListDatagrid />
    <GiftCardsListOrderInfoCard />
  </>
);

export default GiftCardsListPage;
