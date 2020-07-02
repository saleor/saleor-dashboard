/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { InvoiceErrorCode, JobStatusEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: InvoiceRequest
// ====================================================

export interface InvoiceRequest_invoiceRequest_errors {
  __typename: "InvoiceError";
  code: InvoiceErrorCode;
  field: string | null;
}

export interface InvoiceRequest_invoiceRequest_invoice {
  __typename: "Invoice";
  id: string;
  number: string | null;
  createdAt: any;
  url: string | null;
  status: JobStatusEnum;
}

export interface InvoiceRequest_invoiceRequest_order_invoices {
  __typename: "Invoice";
  id: string;
  number: string | null;
  createdAt: any;
  url: string | null;
  status: JobStatusEnum;
}

export interface InvoiceRequest_invoiceRequest_order {
  __typename: "Order";
  id: string;
  invoices: (InvoiceRequest_invoiceRequest_order_invoices | null)[] | null;
}

export interface InvoiceRequest_invoiceRequest {
  __typename: "InvoiceRequest";
  errors: InvoiceRequest_invoiceRequest_errors[];
  invoice: InvoiceRequest_invoiceRequest_invoice | null;
  order: InvoiceRequest_invoiceRequest_order | null;
}

export interface InvoiceRequest {
  invoiceRequest: InvoiceRequest_invoiceRequest | null;
}

export interface InvoiceRequestVariables {
  orderId: string;
}
