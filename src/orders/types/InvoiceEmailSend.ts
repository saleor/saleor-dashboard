/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { InvoiceErrorCode, JobStatusEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: InvoiceEmailSend
// ====================================================

export interface InvoiceEmailSend_invoiceSendNotification_errors {
  __typename: "InvoiceError";
  code: InvoiceErrorCode;
  field: string | null;
}

export interface InvoiceEmailSend_invoiceSendNotification_invoice {
  __typename: "Invoice";
  id: string;
  number: string | null;
  createdAt: any;
  url: string | null;
  status: JobStatusEnum;
}

export interface InvoiceEmailSend_invoiceSendNotification {
  __typename: "InvoiceSendNotification";
  errors: InvoiceEmailSend_invoiceSendNotification_errors[];
  invoice: InvoiceEmailSend_invoiceSendNotification_invoice | null;
}

export interface InvoiceEmailSend {
  invoiceSendNotification: InvoiceEmailSend_invoiceSendNotification | null;
}

export interface InvoiceEmailSendVariables {
  id: string;
}
