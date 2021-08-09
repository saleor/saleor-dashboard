import Container from "@saleor/components/Container";
import useNavigator from "@saleor/hooks/useNavigator";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import React from "react";

import GiftCardDeleteDialog from "../components/GiftCardDeleteDialog";
import GiftCardCreateDialog from "../GiftCardCreateDialog";
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

  const handleModalOpen = (action: GiftCardListActionParamsEnum) => (
    id?: string
  ) => {
    if (id) {
      openModal(action, { "delete-gift-card-id": id });
      return;
    }

    openModal(action);
  };

  return (
    <>
      <GiftCardsListProvider params={params}>
        <Container>
          <GiftCardsListHeader
            onIssueButtonClick={handleModalOpen(
              GiftCardListActionParamsEnum.CREATE
            )}
          />
          <GiftCardsListTable
            onDelete={handleModalOpen(GiftCardListActionParamsEnum.DELETE)}
          />
        </Container>
        <GiftCardCreateDialog
          open={params?.action === GiftCardListActionParamsEnum.CREATE}
          onClose={closeModal}
        />
        <GiftCardDeleteDialog
          open={params?.action === GiftCardListActionParamsEnum.DELETE}
          id={params?.["delete-gift-card-id"]}
          onClose={closeModal}
        />
      </GiftCardsListProvider>
    </>
  );
};

export default GiftCardsList;
