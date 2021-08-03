import Container from "@saleor/components/Container";
import useNavigator from "@saleor/hooks/useNavigator";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import React from "react";

import GiftCardCreateDialog from "../GiftCardCreateDialog";
import GiftCardCreateFormProvider from "../GiftCardCreateDialog/providers/GiftCardCreateFormProvider";
import { giftCardsListUrl } from "../urls";
import GiftCardsListHeader from "./GiftCardsListHeader";
import GiftCardsListTable from "./GiftCardsListTable";
import { GiftCardsListProvider } from "./providers/GiftCardsListProvider";
import {
  GiftCardListActionParamsEnum,
  GiftCardListUrlQueryParams
} from "./types";

interface GiftCardsListProps {
  params: GiftCardListUrlQueryParams;
}

const GiftCardsList: React.FC<GiftCardsListProps> = ({ params }) => {
  const navigate = useNavigator();

  const [openModal, closeModal] = createDialogActionHandlers<
    GiftCardListActionParamsEnum,
    GiftCardListUrlQueryParams
  >(navigate, giftCardsListUrl, params);

  const openCreateModal = () => openModal(GiftCardListActionParamsEnum.CREATE);

  return (
    <GiftCardCreateFormProvider onSubmitSuccess={closeModal}>
      <GiftCardsListProvider params={params}>
        <Container>
          <GiftCardsListHeader onIssueButtonClick={openCreateModal} />
          <GiftCardsListTable />
        </Container>
      </GiftCardsListProvider>
      <GiftCardCreateDialog action={params?.action} onClose={closeModal} />
    </GiftCardCreateFormProvider>
  );
};

export default GiftCardsList;
