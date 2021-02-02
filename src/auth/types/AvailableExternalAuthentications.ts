/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AvailableExternalAuthentications
// ====================================================

export interface AvailableExternalAuthentications_shop_availableExternalAuthentications {
  __typename: "ExternalAuthentication";
  id: string;
  name: string | null;
}

export interface AvailableExternalAuthentications_shop {
  __typename: "Shop";
  availableExternalAuthentications: AvailableExternalAuthentications_shop_availableExternalAuthentications[];
}

export interface AvailableExternalAuthentications {
  shop: AvailableExternalAuthentications_shop;
}
