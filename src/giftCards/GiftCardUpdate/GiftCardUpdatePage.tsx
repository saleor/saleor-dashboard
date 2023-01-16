import CardSpacer from "@dashboard/components/CardSpacer";
import Container from "@dashboard/components/Container";
import Grid from "@dashboard/components/Grid";
import Metadata from "@dashboard/components/Metadata";
import Savebar from "@dashboard/components/Savebar";
import useNavigator from "@dashboard/hooks/useNavigator";
import React from "react";

import { giftCardsListPath } from "../urls";
import GiftCardHistory from "./GiftCardHistory/GiftCardHistory";
import GiftCardUpdateDetailsCard from "./GiftCardUpdateDetailsCard";
import GiftCardUpdateInfoCard from "./GiftCardUpdateInfoCard";
import GiftCardUpdatePageHeader from "./GiftCardUpdatePageHeader";
import useGiftCardUpdateDialogs from "./providers/GiftCardUpdateDialogsProvider/hooks/useGiftCardUpdateDialogs";
import useGiftCardUpdate from "./providers/GiftCardUpdateFormProvider/hooks/useGiftCardUpdate";
import useGiftCardUpdateForm from "./providers/GiftCardUpdateFormProvider/hooks/useGiftCardUpdateForm";

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
    <Container>
      <GiftCardUpdatePageHeader />
      <Grid>
        <div>
          <GiftCardUpdateDetailsCard />
          <CardSpacer />
          <Metadata data={data} onChange={changeMetadata} />
        </div>
        <div>
          <GiftCardUpdateInfoCard />
        </div>
        <GiftCardHistory />
      </Grid>
      <Savebar
        state={status}
        onCancel={() => navigate(giftCardsListPath)}
        disabled={loadingUpdate}
        onSubmit={submit}
        onDelete={openDeleteDialog}
      />
    </Container>
  );
};

export default GiftCardUpdatePage;
