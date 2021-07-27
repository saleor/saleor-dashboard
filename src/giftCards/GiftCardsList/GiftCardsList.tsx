import Container from "@saleor/components/Container";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import React from "react";

import GiftCardCreateDialog from "./GiftCardCreateDialog";
import GiftCardCreateFormProvider from "./GiftCardCreateFormProvider";
import GiftCardsListHeader from "./GiftCardsListHeader";
import { GiftCardsListProvider } from "./GiftCardsListProvider";
import GiftCardsListTable from "./GiftCardsListTable";
import { GiftCardListParamsEnum, GiftCardListUrlQueryParams } from "./types";

interface GiftCardsListProps {
  params: GiftCardListUrlQueryParams;
}

const GiftCardsList: React.FC<GiftCardsListProps> = ({ params }) => {
  const [openModal, closeModal] = createDialogActionHandlers<
    GiftCardListParamsEnum,
    GiftCardListUrlQueryParams
  >(navigate, collectionListUrl, params);

  return (
    <GiftCardCreateFormProvider>
      <GiftCardsListProvider params={params}>
        <Container>
          <GiftCardsListHeader />
          <GiftCardsListTable />
        </Container>
      </GiftCardsListProvider>
      <GiftCardCreateDialog
        open={params?.action === GiftCardListParamsEnum.CREATE}
      />
    </GiftCardCreateFormProvider>
  );
};

export default GiftCardsList;
