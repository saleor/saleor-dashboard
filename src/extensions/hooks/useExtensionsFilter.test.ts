import { useExtensionsFilter } from "@dashboard/extensions/hooks/useExtenstionsFilter";
import { ExtensionsGroups } from "@dashboard/extensions/types";
import { act } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";

describe("Extensions / hooks / useExtensionsFilter", () => {
  it("should allow filter extensions by name", async () => {
    const extensions = {
      group1: [
        { name: "Extension 1", id: "1" },
        { name: "Extension 2", id: "2" },
      ],
      group2: [
        { name: "Extension 3", id: "3" },
        { name: "Extension 4", id: "4" },
      ],
    } as unknown as ExtensionsGroups;

    const { result } = renderHook(() => useExtensionsFilter({ extensions }));

    // Act
    act(() => {
      result.current.handleQueryChange("1");
    });

    // Assert
    expect(result.current.query).toBe("1");
    expect(result.current.filteredExtensions).toEqual({
      group1: [{ name: "Extension 1", id: "1" }],
      group2: [],
    });
  });
});
