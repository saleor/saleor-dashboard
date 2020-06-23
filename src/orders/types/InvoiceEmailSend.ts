/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { InvoiceErrorCode, JobStatusEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: InvoiceEmailSend
// ====================================================

export interface InvoiceEmailSend_sendInvoiceEmail_errors {
  __typename: "InvoiceError";
  code: InvoiceErrorCode;
  field: string | null;
}

export interface InvoiceEmailSend_sendInvoiceEmail_invoice {
  __typename: "Invoice";
  id: string;
  number: string | null;
  createdAt: any;
  url: string | null;
  status: JobStatusEnum;
}

export interface InvoiceEmailSend_sendInvoiceEmail {
  __typename: "SendInvoiceEmail";
  errors: InvoiceEmailSend_sendInvoiceEmail_errors[];
  invoice: InvoiceEmailSend_sendInvoiceEmail_invoice | null;
}

export interface InvoiceEmailSend {
  sendInvoiceEmail: InvoiceEmailSend_sendInvoiceEmail | null;
}

export interface InvoiceEmailSendVariables {
  id: string;
}
