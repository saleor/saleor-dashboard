import Container from "@saleor/components/Container";
import React from "react";

import GiftCardDetailsProvider from "./GiftCardDetailsProvider";
import GiftCardUpdateDetailsCard from "./GiftCardUpdateDetailsCard";
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
        <GiftCardUpdateDetailsCard />
      </Container>
    </GiftCardUpdateFormProvider>
  </GiftCardDetailsProvider>
);

export default GiftCardUpdatePage;
