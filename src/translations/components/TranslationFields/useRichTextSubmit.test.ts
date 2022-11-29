import { SubmitPromise } from "@saleor/hooks/useForm";
import { renderHook } from "@testing-library/react-hooks";

import { useRichTextSubmit } from "./useRichTextSubmit";

const richTextMock = `{
  time: 1669371906847,
  blocks: [
    {
      id: "TLzBn1f3y0",
      data: { text: "40x40 Terracota" },
      type: "paragraph",
    },
  ],
  version: "2.24.3",
}`;

const setup = (inital: string, submitFn: () => SubmitPromise) =>
  renderHook(() => {
    const { handleSubmit, editorRef } = useRichTextSubmit(inital, submitFn);

    return {
      handleSubmit,
      editorRef,
    };
  });

describe("useRichTextSubmit", () => {
  it("Submits the data", async () => {
    // Given
    const submitFn = jest.fn(() => Promise.resolve([]));
    const { result } = setup(richTextMock, submitFn);

    // When
    result.current.handleSubmit();

    // Then
    expect(submitFn).toHaveBeenCalledWith(richTextMock);
  });
});
