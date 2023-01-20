import { renderHook } from "@testing-library/react-hooks";

import { usePasteRowsCalculation } from "./usePasteRowsCalculation";

describe("usePasteRowsCalculation", () => {
  it("generater rows array starting from 5th row", () => {
    const onRowsCalculated = jest.fn();
    const totalRows = 5;
    const rowsPasted = "row1\nrow2\nrow3\n";
    const addEventListener = jest.fn().mockImplementation((_, handler) => {
      const event = {
        clipboardData: {
          getData: () => rowsPasted,
        },
      };

      handler(event);
    });
    const anchor = ({ addEventListener } as any) as Window;

    const { rerender } = renderHook(() =>
      usePasteRowsCalculation({
        onRowsCalculated,
        totalRows,
        anchor,
      }),
    );
    rerender();

    expect(addEventListener).toBeCalled();
    expect(onRowsCalculated).toHaveBeenCalledWith([5, 6, 7, 8]);
  });
});
