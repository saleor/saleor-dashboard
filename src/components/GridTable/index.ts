import { GridTableBody as Body } from "./Body";
import { GridTableCell as Cell } from "./Cell";
import { GridTableCol as Col } from "./Col";
import { GridTableColgroup as Colgroup } from "./Colgroup";
import { GridTableRoot } from "./Root";
import { GridTableRow as Row } from "./Row";

export const GridTable = Object.assign(GridTableRoot, {
  Body,
  Row,
  Cell,
  Col,
  Colgroup,
});
