import { CatalogRule } from "./Catalog/CatalogRule";
import { OrderRule } from "./Order/OrderRule";

export type Rule = OrderRule | CatalogRule;

export * from "./Condition";
