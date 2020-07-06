import { invoiceFragment } from "@saleor/fragments/orders";
import gql from "graphql-tag";

export const checkExportFileStatus = gql`
  query CheckExportFileStatus($id: ID!) {
    exportFile(id: $id) {
      id
      status
    }
  }
`;

export const checkOrderInvoicesStatus = gql`
  ${invoiceFragment}
  query CheckOrderInvoicesStatus($id: ID!) {
    order(id: $id) {
      id
      invoices {
        ...InvoiceFragment
      }
    }
  }
`;
