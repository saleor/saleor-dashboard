import { Content } from '@dashboard/components/AppLayout/Content';
import { DetailedContent } from '@dashboard/components/AppLayout/DetailedContent';
import { RightSidebar } from '@dashboard/components/AppLayout/RightSidebar';
import CardSpacer from '@dashboard/components/CardSpacer';
import Metadata from '@dashboard/components/Metadata';
import Savebar from '@dashboard/components/Savebar';
import useNavigator from '@dashboard/hooks/useNavigator';
import React from 'react';

import { giftCardsListPath } from '../urls';
import GiftCardHistory from './GiftCardHistory/GiftCardHistory';
import GiftCardUpdateDetailsCard from './GiftCardUpdateDetailsCard';
import GiftCardUpdateInfoCard from './GiftCardUpdateInfoCard';
import GiftCardUpdatePageHeader from './GiftCardUpdatePageHeader';
import useGiftCardUpdateDialogs from './providers/GiftCardUpdateDialogsProvider/hooks/useGiftCardUpdateDialogs';
import useGiftCardUpdate from './providers/GiftCardUpdateFormProvider/hooks/useGiftCardUpdate';
import useGiftCardUpdateForm from './providers/GiftCardUpdateFormProvider/hooks/useGiftCardUpdateForm';

const GiftCardUpdatePage: React.FC = () => {
  const { openDeleteDialog } = useGiftCardUpdateDialogs();
  const navigate = useNavigator();

  const {
    submit,
    data,
    handlers: { changeMetadata },
  } = useGiftCardUpdateForm();

  const {
    opts: { loading: loadingUpdate, status },
  } = useGiftCardUpdate();

  return (
    <DetailedContent>
      <GiftCardUpdatePageHeader />
      <Content>
        <GiftCardUpdateDetailsCard />
        <CardSpacer />
        <Metadata data={data} onChange={changeMetadata} />
        <GiftCardHistory />
      </Content>
      <RightSidebar>
        <GiftCardUpdateInfoCard />
      </RightSidebar>

      <Savebar
        state={status}
        onCancel={() => navigate(giftCardsListPath)}
        disabled={loadingUpdate}
        onSubmit={submit}
        onDelete={openDeleteDialog}
      />
    </DetailedContent>
  );
};

export default GiftCardUpdatePage;
