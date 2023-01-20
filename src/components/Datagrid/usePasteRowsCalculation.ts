import React from "react";

interface HookProps {
  totalRows: number;
  anchor: Window;
  onRowsCalculated: (rows: number[]) => void;
}

export const usePasteRowsCalculation = ({
  totalRows,
  anchor,
  onRowsCalculated,
}: HookProps) => {
  React.useEffect(() => {
    const handlePaste = evt => {
      const count = evt.clipboardData.getData("text").split("\n").length;
      const newRows = Array(count)
        .fill(totalRows)
        .map((x, y) => x + y);

      onRowsCalculated(newRows);
    };

    anchor.addEventListener("paste", handlePaste, { capture: true });

    return () => {
      anchor.removeEventListener("paste", handlePaste);
    };
  }, [totalRows, anchor]);
};
