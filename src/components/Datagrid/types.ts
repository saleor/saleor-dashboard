import { CellBase } from "react-spreadsheet";

interface DatagridCellBase extends CellBase<string> {
  column: string;
  id: string;
}

export interface StringDatagridCell extends DatagridCellBase {
  type: "string";
}

export interface NumberDatagridCell extends DatagridCellBase {
  type: "number";
  min?: number;
  max?: number;
  step?: number;
}

export interface MoneyDatagridCell extends DatagridCellBase {
  currency: string;
  type: "money";
}

export interface MoneyToggleDatagridCell extends DatagridCellBase {
  currency: string;
  toggled: boolean;
  type: "moneyToggle";
}

export type DatagridCell =
  | StringDatagridCell
  | NumberDatagridCell
  | MoneyDatagridCell
  | MoneyToggleDatagridCell;

export interface AvailableColumn {
  id: string;
  title: string;
  width: number;
}
