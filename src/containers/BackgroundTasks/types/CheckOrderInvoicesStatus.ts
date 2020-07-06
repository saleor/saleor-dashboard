/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { JobStatusEnum } from "./../../../types/globalTypes";

// ====================================================
// GraphQL query operation: CheckOrderInvoicesStatus
// ====================================================

export interface CheckOrderInvoicesStatus_order_invoices {
  __typename: "Invoice";
  id: string;
  number: string | null;
  createdAt: any;
  url: string | null;
  status: JobStatusEnum;
}

export interface CheckOrderInvoicesStatus_order {
  __typename: "Order";
  id: string;
  invoices: (CheckOrderInvoicesStatus_order_invoices | null)[] | null;
}

export interface CheckOrderInvoicesStatus {
  order: CheckOrderInvoicesStatus_order | null;
}

export interface CheckOrderInvoicesStatusVariables {
  id: string;
}
