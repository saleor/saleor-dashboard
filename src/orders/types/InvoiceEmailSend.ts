/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { InvoiceErrorCode, JobStatusEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: InvoiceEmailSend
// ====================================================

export interface InvoiceEmailSend_invoiceSendEmail_errors {
  __typename: "InvoiceError";
  code: InvoiceErrorCode;
  field: string | null;
}

export interface InvoiceEmailSend_invoiceSendEmail_invoice {
  __typename: "Invoice";
  id: string;
  number: string | null;
  createdAt: any;
  url: string | null;
  status: JobStatusEnum;
}

export interface InvoiceEmailSend_invoiceSendEmail {
  __typename: "InvoiceSendEmail";
  errors: InvoiceEmailSend_invoiceSendEmail_errors[];
  invoice: InvoiceEmailSend_invoiceSendEmail_invoice | null;
}

export interface InvoiceEmailSend {
  invoiceSendEmail: InvoiceEmailSend_invoiceSendEmail | null;
}

export interface InvoiceEmailSendVariables {
  id: string;
}
