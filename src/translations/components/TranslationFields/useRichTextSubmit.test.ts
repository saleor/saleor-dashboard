import useRichText from "@dashboard/utils/richText/useRichText";
import { renderHook } from "@testing-library/react-hooks";

import { useRichTextSubmit } from "./useRichTextSubmit";

jest.mock("@dashboard/utils/richText/useRichText", () => jest.fn());

describe("useRichTextSubmit", () => {
  it("submits value from editor succesfully", async () => {
    // Given
    const textEditorValue = "text editor value";
    const getValue = jest.fn(() => textEditorValue);
    (useRichText as jest.Mock).mockImplementation(() => ({ getValue }));
    const submitFn = jest.fn();
    const { result } = renderHook(() =>
      useRichTextSubmit("initial", submitFn, false),
    );

    // When
    await result.current.handleSubmit();

    // Then
    expect(submitFn).toHaveBeenCalledWith(textEditorValue);
  });
});
