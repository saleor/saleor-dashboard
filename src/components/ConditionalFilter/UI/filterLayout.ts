import { type ConditionalFiltersLayout } from "./Root";

export const isFlatFilterLayout = (
  layout?: ConditionalFiltersLayout,
): layout is "inline" | "panel" => layout === "inline" || layout === "panel";
