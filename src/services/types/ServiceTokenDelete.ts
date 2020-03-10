/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AccountErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ServiceTokenDelete
// ====================================================

export interface ServiceTokenDelete_serviceAccountTokenDelete_errors {
  __typename: "AccountError";
  code: AccountErrorCode;
  field: string | null;
}

export interface ServiceTokenDelete_serviceAccountTokenDelete {
  __typename: "ServiceAccountTokenDelete";
  errors: ServiceTokenDelete_serviceAccountTokenDelete_errors[];
}

export interface ServiceTokenDelete {
  serviceAccountTokenDelete: ServiceTokenDelete_serviceAccountTokenDelete | null;
}

export interface ServiceTokenDeleteVariables {
  id: string;
}
