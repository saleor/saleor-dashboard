import { AddRowButton, ClearButton, CloseButton, ConfirmButton, Footer } from "./Footer";
import { Root } from "./Root";

export { isFlatFilterLayout } from "./filterLayout";
export type { ConditionalFiltersLayout, ExperimentalFiltersProps } from "./Root";
export type { FilterEvent, Row } from "./types";

export const Filters = Object.assign(Root, {
  AddRowButton,
  ConfirmButton,
  ClearButton,
  CloseButton,
  Footer,
});
