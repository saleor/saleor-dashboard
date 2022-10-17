import { TransactionItemFragment } from "@saleor/graphql";
import React from "react";

interface TransactionCardProps {
  transaction: TransactionItemFragment;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
}) => <div>{transaction.type}</div>;
