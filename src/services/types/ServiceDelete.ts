/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ServiceDelete
// ====================================================

export interface ServiceDelete_serviceAccountDelete_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface ServiceDelete_serviceAccountDelete {
  __typename: "ServiceAccountDelete";
  errors: ServiceDelete_serviceAccountDelete_errors[];
}

export interface ServiceDelete {
  serviceAccountDelete: ServiceDelete_serviceAccountDelete | null;
}

export interface ServiceDeleteVariables {
  id: string;
}
