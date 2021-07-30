import Container from "@saleor/components/Container";
import Grid from "@saleor/components/Grid";
import Savebar from "@saleor/components/Savebar";
import useNavigator from "@saleor/hooks/useNavigator";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import React from "react";

import { giftCardsListPath, giftCardUrl } from "../urls";
import GiftCardUpdateBalanceDialog from "./GiftCardUpdateBalanceDialog";
import GiftCardUpdateDetailsCard from "./GiftCardUpdateDetailsCard";
import GiftCardUpdateInfoCard from "./GiftCardUpdateInfoCard";
import GiftCardUpdatePageHeader from "./GiftCardUpdatePageHeader";
import GiftCardDetailsProvider, {
  GiftCardDetailsContext
} from "./providers/GiftCardDetailsProvider";
import GiftCardUpdateFormProvider, {
  GiftCardUpdateFormContext
} from "./providers/GiftCardUpdateFormProvider";
import {
  GiftCardUpdatePageActionParamsEnum,
  GiftCardUpdatePageUrlQueryParams
} from "./types";

interface GiftCardUpdatePageProps {
  params: GiftCardUpdatePageUrlQueryParams;
  id: string;
}

const GiftCardUpdatePage: React.FC<GiftCardUpdatePageProps> = ({
  id,
  params
}) => {
  const navigate = useNavigator();

  const navigateBack = () => navigate(giftCardsListPath);

  const [openModal, closeModal] = createDialogActionHandlers<
    GiftCardUpdatePageActionParamsEnum,
    GiftCardUpdatePageUrlQueryParams
  >(navigate, params => giftCardUrl(id, params), params);

  const openSetBalanceDialog = () =>
    openModal(GiftCardUpdatePageActionParamsEnum.SET_BALANCE);

  return (
    <GiftCardDetailsProvider id={id}>
      <GiftCardUpdateFormProvider onBalanceUpdateSuccess={closeModal}>
        <Container>
          <GiftCardUpdatePageHeader onBack={navigateBack} />
          <Grid>
            <div>
              <GiftCardUpdateDetailsCard
                onSetBalanceButtonClick={openSetBalanceDialog}
              />
            </div>
            <div>
              <GiftCardUpdateInfoCard />
            </div>
          </Grid>

          <GiftCardDetailsContext.Consumer>
            {({ loading, giftCard }) =>
              !loading &&
              giftCard && (
                <GiftCardUpdateBalanceDialog
                  onClose={closeModal}
                  action={params?.action}
                />
              )
            }
          </GiftCardDetailsContext.Consumer>

          <GiftCardUpdateFormContext.Consumer>
            {({ opts: { loading, status }, hasChanged, submit }) => (
              <Savebar
                state={status}
                disabled={loading || !hasChanged}
                onCancel={navigateBack}
                onSubmit={submit}
              />
            )}
          </GiftCardUpdateFormContext.Consumer>
        </Container>
      </GiftCardUpdateFormProvider>
    </GiftCardDetailsProvider>
  );
};

export default GiftCardUpdatePage;
