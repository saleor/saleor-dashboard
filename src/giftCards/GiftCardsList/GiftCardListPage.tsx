import GiftCardListSearchAndFilters from "./GiftCardListSearchAndFilters";
import { GiftCardsListDatagrid } from "./GiftCardsListDatagrid";
import GiftCardsListHeader from "./GiftCardsListHeader";

const GiftCardsListPage = () => (
  <>
    <GiftCardsListHeader />
    <GiftCardListSearchAndFilters />
    <GiftCardsListDatagrid />
  </>
);

export default GiftCardsListPage;
