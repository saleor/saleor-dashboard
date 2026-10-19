import { type OutputData } from "@editorjs/editorjs";
import { type EditorCore } from "@react-editor-js/core";
import { act, renderHook } from "@testing-library/react";

import useRichText from "./useRichText";

type Fixtures = Record<"short", OutputData>;

const fixtures: Fixtures = {
  short: {
    blocks: [
      {
        data: {
          text: "Some text",
        },
        type: "paragraph",
      },
    ],
  },
};
const triggerChange = jest.fn();

const createEditor = (save: EditorCore["save"]): EditorCore => ({
  save,
  destroy: jest.fn(),
  clear: jest.fn(),
  render: jest.fn(),
  dangerouslyLowLevelInstance: null,
});

describe("useRichText", () => {
  it("properly informs RichTextEditor when data is ready to mount", () => {
    const { result, rerender } = renderHook(
      ({ initial, loading }) => useRichText({ initial, loading, triggerChange }),
      { initialProps: { initial: undefined as string | undefined, loading: true } },
    );

    expect(result.current.isReadyForMount).toBe(false);
    rerender({ initial: JSON.stringify(fixtures.short), loading: false });
    expect(result.current.defaultValue).toStrictEqual(fixtures.short);
    expect(result.current.isReadyForMount).toBe(true);
    expect(result.current.isDirty).toBe(false);
  });
  it("mounts empty editor when JSON cannot be parsed", () => {
    const { result, rerender } = renderHook(
      ({ initial, loading }) => useRichText({ initial, loading, triggerChange }),
      { initialProps: { initial: undefined as string | undefined, loading: true } },
    );

    expect(result.current.isReadyForMount).toBe(false);
    rerender({ initial: "this-isnt-valid-json", loading: false });
    expect(result.current.defaultValue).toStrictEqual({ blocks: [] });
    expect(result.current.isReadyForMount).toBe(true);
    expect(result.current.isDirty).toBe(false);
  });

  it("resets editor readiness while loading", () => {
    const { result, rerender } = renderHook(
      ({ initial, loading }) => useRichText({ initial, loading, triggerChange }),
      {
        initialProps: {
          initial: JSON.stringify(fixtures.short),
          loading: false,
        },
      },
    );

    expect(result.current.isReadyForMount).toBe(true);
    rerender({ initial: JSON.stringify(fixtures.short), loading: true });
    expect(result.current.isReadyForMount).toBe(false);
    expect(result.current.defaultValue).toBeUndefined();
  });
  it("runs editorJS .save() when getValue is called", async () => {
    const saveFn = jest.fn(async () => fixtures.short);
    const { result } = renderHook(() => useRichText({ initial: "", triggerChange }));

    result.current.editorRef.current = {
      save: saveFn,
      destroy: jest.fn(),
      clear: jest.fn(),
      render: jest.fn(),
      dangerouslyLowLevelInstance: {},
    };
    expect(await result.current.getValue()).toStrictEqual(fixtures.short);
    expect(saveFn).toHaveBeenCalled();
    expect(result.current.isDirty).toBe(false);
  });
  it("calls triggerChange when change is made in the editor", () => {
    triggerChange.mockClear();

    const { result } = renderHook(() => useRichText({ initial: "", triggerChange }));

    act(() => {
      result.current.handleChange();
    });
    expect(triggerChange).toHaveBeenCalled();
    expect(result.current.isDirty).toBe(true);
  });

  it("keeps changes dirty until the editor has finished reading", async () => {
    // Arrange
    let finishRead: (value: OutputData) => void = () => undefined;
    const read = new Promise<OutputData>(resolve => {
      finishRead = resolve;
    });
    const { result } = renderHook(() => useRichText({ initial: "", triggerChange }));

    result.current.editorRef.current = createEditor(() => read);
    act(() => result.current.handleChange());

    let pendingRead: Promise<OutputData>;

    // Act
    act(() => {
      pendingRead = result.current.getValue();
    });

    // Assert
    expect(result.current.isDirty).toBe(true);

    // Act
    await act(async () => {
      finishRead(fixtures.short);
      await pendingRead;
    });

    // Assert
    expect(result.current.isDirty).toBe(false);
  });

  it("keeps changes dirty when reading the editor rejects", async () => {
    // Arrange
    const error = new Error("Cannot read editor");
    const { result } = renderHook(() => useRichText({ initial: "", triggerChange }));

    result.current.editorRef.current = createEditor(async () => {
      throw error;
    });
    act(() => result.current.handleChange());

    // Act
    await act(async () => {
      await expect(result.current.getValue()).rejects.toBe(error);
    });

    // Assert
    expect(result.current.isDirty).toBe(true);
  });

  it("keeps edits made while the editor is being read dirty", async () => {
    // Arrange
    let finishRead: (value: OutputData) => void = () => undefined;
    const read = new Promise<OutputData>(resolve => {
      finishRead = resolve;
    });
    const { result } = renderHook(() => useRichText({ initial: "", triggerChange }));

    result.current.editorRef.current = createEditor(() => read);
    act(() => result.current.handleChange());

    let pendingRead: Promise<OutputData>;

    // Act
    act(() => {
      pendingRead = result.current.getValue();
    });
    act(() => result.current.handleChange());
    await act(async () => {
      finishRead(fixtures.short);
      await pendingRead;
    });

    // Assert
    expect(result.current.isDirty).toBe(true);
  });
});
