import { AddRowButton, ClearButton, ConfirmButton, Footer } from "./Footer";
import { Root } from "./Root";

export type { ExperimentalFiltersProps } from "./Root";
export type { FilterEvent, Row } from "./types";

export const Filters = Object.assign(Root, {
  AddRowButton,
  ConfirmButton,
  ClearButton,
  Footer,
});
