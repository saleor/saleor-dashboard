/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { InvoiceErrorCode, JobStatusEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: InvoiceRequest
// ====================================================

export interface InvoiceRequest_requestInvoice_errors {
  __typename: "InvoiceError";
  code: InvoiceErrorCode;
  field: string | null;
}

export interface InvoiceRequest_requestInvoice_invoice {
  __typename: "Invoice";
  id: string;
  number: string | null;
  createdAt: any;
  url: string | null;
  status: JobStatusEnum;
}

export interface InvoiceRequest_requestInvoice {
  __typename: "RequestInvoice";
  errors: InvoiceRequest_requestInvoice_errors[];
  invoice: InvoiceRequest_requestInvoice_invoice | null;
}

export interface InvoiceRequest {
  requestInvoice: InvoiceRequest_requestInvoice | null;
}

export interface InvoiceRequestVariables {
  orderId: string;
}
