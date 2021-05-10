/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { MetadataErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: MetadataErrorFragment
// ====================================================

interface ParamsFragment {
    value: string | null;
}

export interface MetadataErrorFragment {
  __typename: "MetadataError";
  code: MetadataErrorCode;
  field: string | null;
   params : ParamsFragment ;
}
