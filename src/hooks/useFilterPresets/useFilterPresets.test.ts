import { act, renderHook } from "@testing-library/react-hooks";

import { useFilterPresets } from "./useFilterPresets";

const mockNavigate = jest.fn();

jest.mock("@dashboard/hooks/useNavigator", () => () => mockNavigate);

const baseUrl = "http://localhost";

describe("useFilterPresets", () => {
  const originalWindowLocation = window.location;

  beforeEach(() => {
    Object.defineProperty(window, "location", {
      configurable: true,
      enumerable: true,
      value: new URL(window.location.href),
    });
  });
  afterEach(() => {
    Object.defineProperty(window, "location", {
      configurable: true,
      enumerable: true,
      value: originalWindowLocation,
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should return saved filter presets from storage", () => {
    // Arrange && Act
    const presets = [
      { name: "preset1", data: "data1" },
      { name: "preset2", data: "data2" },
    ];
    const { result } = renderHook(() =>
      useFilterPresets({
        getUrl: jest.fn(),
        params: {},
        reset: jest.fn(),
        storageUtils: {
          deleteFilterTab: jest.fn(),
          getFilterTabs: jest.fn(() => presets),
          saveFilterTab: jest.fn(),
          updateFilterTab: jest.fn(),
        },
      }),
    );

    // Assert
    expect(result.current.presets).toEqual(presets);
  });
  it("should return selected preset index when activeTab param", () => {
    // Arrange & Act
    const { result } = renderHook(() =>
      useFilterPresets({
        getUrl: jest.fn(),
        params: {
          activeTab: "1",
        },
        reset: jest.fn(),
        storageUtils: {
          deleteFilterTab: jest.fn(),
          getFilterTabs: jest.fn(() => []),
          saveFilterTab: jest.fn(),
          updateFilterTab: jest.fn(),
        },
      }),
    );

    // Assert
    expect(result.current.selectedPreset).toEqual(1);
  });
  it("should handle active filter preset change", () => {
    // Arrange
    const savedPreset = { name: "preset1", data: "query=John" };
    const { result } = renderHook(() =>
      useFilterPresets({
        getUrl: jest.fn(() => baseUrl),
        params: {},
        reset: jest.fn(),
        storageUtils: {
          deleteFilterTab: jest.fn(),
          getFilterTabs: jest.fn(() => [savedPreset]),
          saveFilterTab: jest.fn(),
          updateFilterTab: jest.fn(),
        },
      }),
    );

    // Act
    act(() => {
      result.current.onPresetChange(1);
    });
    // Assert
    expect(mockNavigate).toHaveBeenCalledWith(`${baseUrl}?${savedPreset.data}&activeTab=1`);
  });
  it("should handle preset delete and navigate to base url when active preset is equal deleting preset", () => {
    // Arrange
    const mockDeleteStorage = jest.fn();
    const mockReset = jest.fn();
    const { result } = renderHook(() =>
      useFilterPresets({
        getUrl: jest.fn(() => baseUrl),
        params: {
          action: "delete",
          activeTab: "1",
        },
        reset: mockReset,
        storageUtils: {
          deleteFilterTab: mockDeleteStorage,
          getFilterTabs: jest.fn(),
          saveFilterTab: jest.fn(),
          updateFilterTab: jest.fn(),
        },
      }),
    );

    // Act
    act(() => {
      result.current.setPresetIdToDelete(1);
    });
    act(() => {
      result.current.onPresetDelete();
    });
    // Assert
    expect(mockDeleteStorage).toHaveBeenCalledWith(1);
    expect(mockReset).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith(baseUrl);
  });
  it("should handle preset delete and navigate to active preset when preset to delete is different that preset to delete", () => {
    // Arrange
    const mockDeleteStorage = jest.fn();
    const mockReset = jest.fn();
    const { result } = renderHook(() =>
      useFilterPresets({
        getUrl: jest.fn(() => baseUrl),
        params: {
          action: "delete",
          activeTab: "2",
        },
        reset: mockReset,
        storageUtils: {
          deleteFilterTab: mockDeleteStorage,
          getFilterTabs: jest.fn(),
          saveFilterTab: jest.fn(),
          updateFilterTab: jest.fn(),
        },
      }),
    );

    // Act
    act(() => {
      result.current.setPresetIdToDelete(1);
    });
    act(() => {
      result.current.onPresetDelete();
    });
    // Assert
    expect(mockDeleteStorage).toHaveBeenCalledWith(1);
    expect(mockReset).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith(baseUrl + "?activeTab=1");
  });
  it("should handle save new filter preset", () => {
    // Arrange
    const mockSaveStorage = jest.fn();

    window.location.search = "?query=John";

    const { result } = renderHook(() =>
      useFilterPresets({
        getUrl: jest.fn(() => baseUrl),
        params: {},
        reset: jest.fn(),
        storageUtils: {
          deleteFilterTab: jest.fn(),
          getFilterTabs: jest.fn(() => []),
          saveFilterTab: mockSaveStorage,
          updateFilterTab: jest.fn(),
        },
      }),
    );

    // Act
    act(() => {
      result.current.onPresetSave({ name: "new-preset" });
    });
    // Assert
    expect(mockSaveStorage).toHaveBeenCalledWith("new-preset", "query=John");
    expect(mockNavigate).toHaveBeenCalledWith(`${baseUrl}?activeTab=1`);
  });
  it("should handle update existing filter preset", () => {
    // Arrange
    const mockUpdateStorage = jest.fn();

    window.location.search = "?query=JoeDoe";

    const { result } = renderHook(() =>
      useFilterPresets({
        getUrl: jest.fn(() => baseUrl),
        params: {},
        reset: jest.fn(),
        storageUtils: {
          deleteFilterTab: jest.fn(),
          getFilterTabs: jest.fn(() => [
            {
              name: "current-preset",
              data: "query=John",
            },
          ]),
          saveFilterTab: jest.fn(),
          updateFilterTab: mockUpdateStorage,
        },
      }),
    );

    // Act
    act(() => {
      result.current.onPresetUpdate("current-preset");
    });
    // Assert
    expect(mockUpdateStorage).toHaveBeenCalledWith("current-preset", "query=JoeDoe");
    expect(mockNavigate).toHaveBeenCalledWith(`${baseUrl}?query=John&activeTab=1`);
  });
  it("should return preset name to delete when presetIdToDelete has been specific", () => {
    // Arrange
    const presets = [
      { name: "preset1", data: "data1" },
      { name: "preset2", data: "data2" },
    ];
    const { result } = renderHook(() =>
      useFilterPresets({
        getUrl: jest.fn(),
        params: {
          action: "delete",
        },
        reset: jest.fn(),
        storageUtils: {
          deleteFilterTab: jest.fn(),
          getFilterTabs: jest.fn(() => presets),
          saveFilterTab: jest.fn(),
          updateFilterTab: jest.fn(),
        },
      }),
    );

    // Act
    act(() => {
      result.current.setPresetIdToDelete(1);
    });
    // Assert
    expect(result.current.getPresetNameToDelete()).toEqual("preset1");
  });
  it("should return '...'  when presetIdToDelete has not been specific", () => {
    // Arrange
    const presets = [
      { name: "preset1", data: "data1" },
      { name: "preset2", data: "data2" },
    ];
    const { result } = renderHook(() =>
      useFilterPresets({
        getUrl: jest.fn(),
        params: {
          action: "delete",
        },
        reset: jest.fn(),
        storageUtils: {
          deleteFilterTab: jest.fn(),
          getFilterTabs: jest.fn(() => presets),
          saveFilterTab: jest.fn(),
          updateFilterTab: jest.fn(),
        },
      }),
    );

    // Assert
    expect(result.current.getPresetNameToDelete()).toEqual("preset1");
  });
});
