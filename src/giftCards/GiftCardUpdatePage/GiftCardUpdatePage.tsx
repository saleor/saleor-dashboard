import Container from "@saleor/components/Container";
import Grid from "@saleor/components/Grid";
import Savebar from "@saleor/components/Savebar";
import useNavigator from "@saleor/hooks/useNavigator";
import React from "react";

import { giftCardsListPath } from "../urls";
import GiftCardDetailsProvider from "./GiftCardDetailsProvider";
import GiftCardUpdateDetailsCard from "./GiftCardUpdateDetailsCard";
import GiftCardUpdateFormProvider, {
  GiftCardUpdateFormContext
} from "./GiftCardUpdateFormProvider";
import GiftCardUpdateInfoCard from "./GiftCardUpdateInfoCard";
import GiftCardUpdatePageHeader from "./GiftCardUpdatePageHeader";

interface GiftCardUpdatePageProps {
  id: string;
}

const GiftCardUpdatePage: React.FC<GiftCardUpdatePageProps> = ({ id }) => {
  const navigate = useNavigator();

  const navigateBack = () => navigate(giftCardsListPath);

  return (
    <GiftCardDetailsProvider id={id}>
      <GiftCardUpdateFormProvider>
        <GiftCardUpdateFormContext.Consumer>
          {({ opts: { loading, status }, hasChanged, submit }) => (
            <Container>
              <GiftCardUpdatePageHeader onBack={navigateBack} />
              <Grid>
                <div>
                  <GiftCardUpdateDetailsCard />
                </div>
                <div>
                  <GiftCardUpdateInfoCard />
                </div>
              </Grid>
              <Savebar
                state={status}
                disabled={loading || !hasChanged}
                onCancel={navigateBack}
                onSubmit={submit}
              />
            </Container>
          )}
        </GiftCardUpdateFormContext.Consumer>
      </GiftCardUpdateFormProvider>
    </GiftCardDetailsProvider>
  );
};

export default GiftCardUpdatePage;
