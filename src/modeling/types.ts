import { PageListQuery } from "@dashboard/graphql";
import { RelayToFlat } from "@dashboard/types";

export type Pages = RelayToFlat<NonNullable<PageListQuery["pages"]>>;
export type Page = Pages[number];
