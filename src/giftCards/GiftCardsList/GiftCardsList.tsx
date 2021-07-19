import Container from "@saleor/components/Container";
import useBulkActions from "@saleor/hooks/useBulkActions";
import { BulkActionsProvider } from "@saleor/hooks/useBulkActions/BulkActionsProvider";
import React from "react";

import GiftCardsListHeader from "./GiftCardsListHeader";
import GiftCardsListTable from "./GiftCardsListTable";

const GiftCardsList: React.FC = () => {
  const bulkActions = useBulkActions();

  return (
    // <BulkActionsProvider>
    <Container>
      <GiftCardsListHeader />
      <GiftCardsListTable bulkActions={bulkActions} />
    </Container>
    // </BulkActionsProvider>
  );
};

export default GiftCardsList;
