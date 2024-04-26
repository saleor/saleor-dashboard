import { TableBody as Body } from "./Body";
import { TableCell as Cell } from "./Cell";
import { TableHeader as Header } from "./Header";
import { TableHeaderCell as HeaderCell } from "./HeaderCell";
import { TableRoot } from "./Root";
import { TableRow as Row } from "./Row";

export const DashboardTable = Object.assign(TableRoot, { Body, Row, Cell, Header, HeaderCell });
