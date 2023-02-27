import VerticalSpacer from '@dashboard/apps/components/VerticalSpacer';
import React from 'react';

import GiftCardsListHeader from './GiftCardsListHeader';
import GiftCardsListOrderInfoCard from './GiftCardsListOrderInfoCard/GiftCardsListOrderInfoCard';
import GiftCardsListTable from './GiftCardsListTable';

const GiftCardsListPage: React.FC = () => (
  <>
    <GiftCardsListHeader />
    <GiftCardsListTable />
    <VerticalSpacer spacing={2} />
    <GiftCardsListOrderInfoCard />
  </>
);

export default GiftCardsListPage;
