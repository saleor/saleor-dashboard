import { type PageListQuery } from "@dashboard/graphql";
import { type RelayToFlat } from "@dashboard/types";

export type Pages = RelayToFlat<NonNullable<PageListQuery["pages"]>>;
export type Page = Pages[number];
