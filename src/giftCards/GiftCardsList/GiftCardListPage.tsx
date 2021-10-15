import Container from "@saleor/components/Container";
import React from "react";

import GiftCardsListHeader from "./GiftCardsListHeader";
import GiftCardsListTable from "./GiftCardsListTable";
import { usePageStyles as useStyles } from "./styles";

const GiftCardsListPage: React.FC = () => {
  const classes = useStyles();

  return (
    <Container className={classes.container}>
      <GiftCardsListHeader />
      <GiftCardsListTable />
    </Container>
  );
};

export default GiftCardsListPage;
