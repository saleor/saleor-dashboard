import { type OutputData } from "@editorjs/editorjs";
import { renderHook } from "@testing-library/react";

import { EMPTY_EDITOR_DATA } from "./parseEditorData";
import { useMultipleRichText } from "./useMultipleRichText";

const short: OutputData = {
  blocks: [
    {
      data: {
        text: "Some text",
      },
      type: "paragraph",
    },
  ],
};

describe("useMultipleRichText", () => {
  it("mounts immediately with parsed JSON without updating state during render", () => {
    // Arrange
    const triggerChange = jest.fn();
    const { result } = renderHook(() =>
      useMultipleRichText({
        initial: { attr: JSON.stringify(short) },
        triggerChange,
      }),
    );

    // Act
    const defaultValue = result.current.getters.getDefaultValue("attr");
    const shouldMount = result.current.getters.getShouldMount("attr");

    // Assert
    expect(shouldMount).toBe(true);
    expect(defaultValue).toStrictEqual(short);
  });

  it("returns a stable defaultValue reference while the raw JSON is unchanged", () => {
    // Arrange
    const { result, rerender } = renderHook(
      ({ initial }) =>
        useMultipleRichText({
          initial,
          triggerChange: jest.fn(),
        }),
      { initialProps: { initial: { attr: JSON.stringify(short) } } },
    );

    // Act
    const first = result.current.getters.getDefaultValue("attr");

    rerender({ initial: { attr: JSON.stringify(short) } });

    const second = result.current.getters.getDefaultValue("attr");

    // Assert
    expect(second).toBe(first);
  });

  it("mounts an empty editor when the attribute has no initial value", () => {
    // Arrange
    const { result } = renderHook(() =>
      useMultipleRichText<string>({
        initial: {},
        triggerChange: jest.fn(),
      }),
    );

    // Act / Assert
    expect(result.current.getters.getShouldMount("attr")).toBe(true);
    expect(result.current.getters.getDefaultValue("attr")).toStrictEqual(EMPTY_EDITOR_DATA);
  });

  it("mounts an empty editor when initial JSON cannot be parsed", () => {
    // Arrange
    const { result } = renderHook(() =>
      useMultipleRichText({
        initial: { attr: "this-isnt-valid-json" },
        triggerChange: jest.fn(),
      }),
    );

    // Act / Assert
    expect(result.current.getters.getShouldMount("attr")).toBe(true);
    expect(result.current.getters.getDefaultValue("attr")).toStrictEqual(EMPTY_EDITOR_DATA);
  });
});
