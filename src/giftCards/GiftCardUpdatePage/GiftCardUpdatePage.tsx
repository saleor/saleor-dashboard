import Container from "@saleor/components/Container";
import React from "react";

import GiftCardDetailsProvider from "./GiftCardDetailsProvider";
import GiftCardUpdateDetailsCard from "./GiftCardUpdateDetailsCard";
import GiftCardUpdatePageHeader from "./GiftCardUpdatePageHeader";

interface GiftCardUpdatePageProps {
  id: string;
}

const GiftCardUpdatePage: React.FC<GiftCardUpdatePageProps> = ({ id }) => {
  return (
    <GiftCardDetailsProvider id={id}>
      <Container>
        <GiftCardUpdatePageHeader />
        <GiftCardUpdateDetailsCard />
      </Container>
    </GiftCardDetailsProvider>
  );
};

export default GiftCardUpdatePage;
