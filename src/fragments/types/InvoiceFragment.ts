/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { JobStatusEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: InvoiceFragment
// ====================================================

export interface InvoiceFragment {
  __typename: "Invoice";
  id: string;
  number: string | null;
  createdAt: any;
  url: string | null;
  status: JobStatusEnum;
}
