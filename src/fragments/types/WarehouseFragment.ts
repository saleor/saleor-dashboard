/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { WarehouseClickAndCollectOptionEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: WarehouseFragment
// ====================================================

export interface WarehouseFragment {
  __typename: "Warehouse";
  id: string;
  name: string;
  isPrivate: boolean;
  clickAndCollectOption: WarehouseClickAndCollectOptionEnum;
}
