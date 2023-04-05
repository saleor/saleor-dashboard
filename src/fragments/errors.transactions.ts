import { gql } from "@apollo/client";

export const transactionRequestActionErrorFragment = gql`
  fragment TransactionRequestActionError on TransactionRequestActionError {
    field
    message
    code
  }
`;

export const transactionCreateErrorFragment = gql`
  fragment TransactionCreateError on TransactionCreateError {
    field
    message
    code
  }
`;

export const orderGrantRefundCreateErrorFragment = gql`
  fragment OrderGrantRefundCreateError on OrderGrantRefundCreateError {
    field
    message
    code
  }
`;

export const orderGrantRefundUpdateErrorFragment = gql`
  fragment OrderGrantRefundUpdateError on OrderGrantRefundUpdateError {
    field
    message
    code
  }
`;
