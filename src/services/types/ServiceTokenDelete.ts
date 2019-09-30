/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ServiceTokenDelete
// ====================================================

export interface ServiceTokenDelete_serviceAccountTokenDelete_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface ServiceTokenDelete_serviceAccountTokenDelete {
  __typename: "ServiceAccountTokenDelete";
  errors: ServiceTokenDelete_serviceAccountTokenDelete_errors[] | null;
}

export interface ServiceTokenDelete {
  serviceAccountTokenDelete: ServiceTokenDelete_serviceAccountTokenDelete | null;
}

export interface ServiceTokenDeleteVariables {
  id: string;
}
