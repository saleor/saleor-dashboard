import { act, renderHook } from "@testing-library/react";

import { useExtensionPreferences } from "./useExtensionPreferences";

const mockMutate = jest.fn().mockResolvedValue({ data: {} });
let mockUser: { id: string; metadata: Array<{ key: string; value: string }> } | null = null;

jest.mock("@dashboard/auth/useUser", () => ({
  useUser: () => ({ user: mockUser }),
}));

jest.mock("@dashboard/graphql", () => ({
  useUpdateExtensionPreferencesMutation: () => [mockMutate, { loading: false }],
}));

const extension = { id: "ext", identifier: "e", app: { id: "app", identifier: "a" } };

describe("useExtensionPreferences", () => {
  beforeEach(() => {
    mockMutate.mockClear();
    mockUser = {
      id: "user-1",
      metadata: [
        { key: "dashboard-extensions-preferences", value: JSON.stringify({ "a:e": "pinned" }) },
      ],
    };
  });

  it("resolves state from user metadata", () => {
    // Act
    const { result } = renderHook(() => useExtensionPreferences());

    // Assert
    expect(result.current.getState(extension)).toBe("pinned");
  });

  it("returns 'default' when no entry exists", () => {
    // Arrange
    mockUser = { id: "user-1", metadata: [] };

    // Act
    const { result } = renderHook(() => useExtensionPreferences());

    // Assert
    expect(result.current.getState(extension)).toBe("default");
  });

  it("writes the updated blob via accountUpdate on setState", () => {
    // Act
    const { result } = renderHook(() => useExtensionPreferences());

    act(() => {
      result.current.setState(extension, "hidden");
    });

    // Assert
    expect(mockMutate).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: {
          input: {
            metadata: [
              {
                key: "dashboard-extensions-preferences",
                value: JSON.stringify({ "a:e": "hidden" }),
              },
            ],
          },
        },
      }),
    );
  });

  it("removes the entry when set to default", () => {
    // Act
    const { result } = renderHook(() => useExtensionPreferences());

    act(() => {
      result.current.setState(extension, "default");
    });

    // Assert
    expect(mockMutate).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: {
          input: { metadata: [{ key: "dashboard-extensions-preferences", value: "{}" }] },
        },
      }),
    );
  });

  it("preserves other metadata keys in the optimistic response", () => {
    // Arrange
    mockUser = {
      id: "user-1",
      metadata: [
        { key: "dashboard-extensions-preferences", value: JSON.stringify({ "a:e": "pinned" }) },
        { key: "some_other_key", value: "keep-me" },
      ],
    };

    // Act
    const { result } = renderHook(() => useExtensionPreferences());

    act(() => {
      result.current.setState(extension, "hidden");
    });

    // Assert
    const optimisticMetadata =
      mockMutate.mock.calls[0][0].optimisticResponse.accountUpdate.user.metadata;

    expect(optimisticMetadata).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: "some_other_key", value: "keep-me" }),
        expect.objectContaining({
          key: "dashboard-extensions-preferences",
          value: JSON.stringify({ "a:e": "hidden" }),
        }),
      ]),
    );
  });
});
