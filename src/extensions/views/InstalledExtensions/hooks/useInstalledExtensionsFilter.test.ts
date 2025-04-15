import { InstalledExtension } from "@dashboard/extensions/types";
import { act } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";

import { useInstalledExtensionsFilter } from "./useInstalledExtensionsFilter";

describe("InstalledExtensions / hooks / useInstalledExtensionsFilter", () => {
  it("should allow filter extensions by name", async () => {
    // Arrange
    const installedExtensions = [
      { name: "Extension 1", id: "1" },
      { name: "Extension 2", id: "2" },
    ] as InstalledExtension[];

    const { result } = renderHook(() => useInstalledExtensionsFilter(installedExtensions));

    // Act
    act(() => {
      result.current.handleQueryChange("1");
    });

    // Assert
    expect(result.current.query).toBe("1");
    expect(result.current.filteredInstalledExtensions).toEqual([{ name: "Extension 1", id: "1" }]);
  });
});
