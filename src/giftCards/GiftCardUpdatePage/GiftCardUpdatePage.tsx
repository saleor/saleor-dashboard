import Container from "@saleor/components/Container";
import Grid from "@saleor/components/Grid";
import React from "react";

import GiftCardDetailsProvider from "./GiftCardDetailsProvider";
import GiftCardUpdateDetailsCard from "./GiftCardUpdateDetailsCard";
import GiftCardUpdateInfoCard from "./GiftCardUpdateDetailsCard/GiftCardUpdateInfoCard";
import GiftCardUpdateFormProvider from "./GiftCardUpdateFormProvider";
import GiftCardUpdatePageHeader from "./GiftCardUpdatePageHeader";

interface GiftCardUpdatePageProps {
  id: string;
}

const GiftCardUpdatePage: React.FC<GiftCardUpdatePageProps> = ({ id }) => (
  <GiftCardDetailsProvider id={id}>
    <GiftCardUpdateFormProvider>
      <Container>
        <GiftCardUpdatePageHeader />
        <Grid>
          <div>
            <GiftCardUpdateDetailsCard />
          </div>
          <div>
            <GiftCardUpdateInfoCard />
          </div>
        </Grid>
      </Container>
    </GiftCardUpdateFormProvider>
  </GiftCardDetailsProvider>
);

export default GiftCardUpdatePage;
