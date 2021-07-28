import Container from "@saleor/components/Container";
import useNavigator from "@saleor/hooks/useNavigator";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import React from "react";

import GiftCardCreateDialog from "../GiftCardCreateDialog";
import { giftCardsListUrl } from "../urls";
import GiftCardCreateFormProvider from "./GiftCardCreateFormProvider";
import GiftCardsListHeader from "./GiftCardsListHeader";
import { GiftCardsListProvider } from "./GiftCardsListProvider";
import GiftCardsListTable from "./GiftCardsListTable";
import { GiftCardListParamsEnum, GiftCardListUrlQueryParams } from "./types";

interface GiftCardsListProps {
  params: GiftCardListUrlQueryParams;
}

const GiftCardsList: React.FC<GiftCardsListProps> = ({ params }) => {
  const navigate = useNavigator();

  const isCreateModalOpen = params?.action === GiftCardListParamsEnum.CREATE;

  const [openModal, closeModal] = createDialogActionHandlers<
    GiftCardListParamsEnum,
    GiftCardListUrlQueryParams
  >(navigate, giftCardsListUrl, params);

  const openCreateModal = () => openModal(GiftCardListParamsEnum.CREATE);

  return (
    <GiftCardCreateFormProvider>
      <GiftCardsListProvider params={params}>
        <Container>
          <GiftCardsListHeader onIssueButtonClick={openCreateModal} />
          <GiftCardsListTable />
        </Container>
      </GiftCardsListProvider>
      <GiftCardCreateDialog open={isCreateModalOpen} onClose={closeModal} />
    </GiftCardCreateFormProvider>
  );
};

export default GiftCardsList;
