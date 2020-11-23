/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: PriceRangeFragment
// ====================================================

export interface PriceRangeFragment_start_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface PriceRangeFragment_start {
  __typename: "TaxedMoney";
  net: PriceRangeFragment_start_net;
}

export interface PriceRangeFragment_stop_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface PriceRangeFragment_stop {
  __typename: "TaxedMoney";
  net: PriceRangeFragment_stop_net;
}

export interface PriceRangeFragment {
  __typename: "TaxedMoneyRange";
  start: PriceRangeFragment_start | null;
  stop: PriceRangeFragment_stop | null;
}
