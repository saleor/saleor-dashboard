import React from "react";
import { DataViewerComponent } from "react-spreadsheet";

import Money from "../Money";
import { MoneyToggleDatagridCell } from "./types";

export const MoneyToggleCellView: DataViewerComponent<MoneyToggleDatagridCell> = ({
  cell,
  setCellData
}) => (
  <div>
    <input
      type="checkbox"
      checked={cell.toggled}
      onMouseDown={e => {
        e.stopPropagation();
        e.preventDefault();
      }}
      onChange={() => setCellData({ ...cell, toggled: !cell.toggled })}
    />
    {cell.value ? (
      <Money
        money={{
          amount: parseFloat(cell.value),
          currency: cell.currency
        }}
      />
    ) : (
      "-"
    )}
  </div>
);
