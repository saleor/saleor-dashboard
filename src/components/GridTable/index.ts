import { GridTableBody as Body } from "./Body";
import { GridTableCell as Cell } from "./Cell";
import { GridTableCol as Col } from "./Col";
import { GridTableColgroup as Colgroup } from "./Colgroup";
import { GridTableHeader as Header } from "./Header";
import { GridTableHeaderCell as HeaderCell } from "./HeaderCell";
import { GridTableRoot } from "./Root";
import { GridTableRow as Row } from "./Row";

export const GridTable = Object.assign(GridTableRoot, {
  Body,
  Row,
  Cell,
  Header,
  HeaderCell,
  Col,
  Colgroup,
});
