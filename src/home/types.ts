import { HomeQuery } from "@dashboard/graphql";
import { RelayToFlat } from "@dashboard/types";

export type Activities = RelayToFlat<NonNullable<HomeQuery["activities"]>>;
export type ProductTopToday = RelayToFlat<
  NonNullable<HomeQuery["productTopToday"]>
>;
