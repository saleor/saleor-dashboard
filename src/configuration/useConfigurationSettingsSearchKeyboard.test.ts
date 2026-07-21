import { type ResolvedSettingsCatalogEntry } from "@dashboard/configuration/settingsCatalog/catalog";
import { act, renderHook } from "@testing-library/react";
import { type KeyboardEvent } from "react";

import { useConfigurationSettingsSearchKeyboard } from "./useConfigurationSettingsSearchKeyboard";

const mockNavigate = jest.fn();
const mockResults: ResolvedSettingsCatalogEntry[] = [
  {
    id: "a",
    title: "Alpha",
    description: "",
    keywords: "",
    breadcrumbs: "Path",
    breadcrumbPath: "Path",
    href: "/a",
    kind: "setting",
    searchText: "Alpha",
  },
  {
    id: "b",
    title: "Beta",
    description: "",
    keywords: "",
    breadcrumbs: "Path",
    breadcrumbPath: "Path",
    href: "/b",
    kind: "setting",
    searchText: "Beta",
  },
];

jest.mock("@dashboard/hooks/useNavigator", () => ({
  __esModule: true,
  default: () => mockNavigate,
}));

jest.mock("@dashboard/configuration/settingsCatalog/catalog", () => ({
  useSettingsCatalogSearch: (query: string) => (query.trim() ? mockResults : []),
}));

const keyEvent = (key: string): KeyboardEvent<HTMLInputElement> =>
  ({
    key,
    preventDefault: jest.fn(),
  }) as unknown as KeyboardEvent<HTMLInputElement>;

describe("useConfigurationSettingsSearchKeyboard", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("moves active index with arrow keys and navigates on Enter", () => {
    // Arrange
    const { result } = renderHook(() => useConfigurationSettingsSearchKeyboard("ref"));

    expect(result.current.activeIndex).toBe(0);

    // Act
    act(() => {
      result.current.onSearchKeyDown(keyEvent("ArrowDown"));
    });

    // Assert
    expect(result.current.activeIndex).toBe(1);

    // Act
    act(() => {
      result.current.onSearchKeyDown(keyEvent("ArrowUp"));
    });

    // Assert
    expect(result.current.activeIndex).toBe(0);

    // Act
    act(() => {
      result.current.onSearchKeyDown(keyEvent("Enter"));
    });

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith("/a");
  });

  it("clears active index when the query is cleared", () => {
    // Arrange
    const { result, rerender } = renderHook(
      ({ query }) => useConfigurationSettingsSearchKeyboard(query),
      { initialProps: { query: "ref" } },
    );

    expect(result.current.activeIndex).toBe(0);

    // Act
    rerender({ query: "" });

    // Assert
    expect(result.current.activeIndex).toBe(-1);
  });
});
