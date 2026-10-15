import { type RichTextEditorProps } from "@dashboard/components/RichTextEditor/RichTextEditor";
import { type OutputData } from "@editorjs/editorjs";
import { type EditorCore } from "@react-editor-js/core";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { type ComponentProps, useImperativeHandle, useState } from "react";

import TranslationFieldsRich from "./TranslationFieldsRich";

const richText = (text: string): OutputData => ({
  blocks: [{ type: "paragraph", data: { text } }],
});

jest.mock("@dashboard/components/RichTextEditor/RichTextEditor", () => ({
  __esModule: true,
  default: function MockRichTextEditor({
    defaultValue,
    disabled,
    editorRef,
    onChange,
  }: RichTextEditorProps): JSX.Element {
    const [text, setText] = useState(String(defaultValue?.blocks?.[0]?.data.text ?? ""));

    useImperativeHandle(
      editorRef,
      (): EditorCore => ({
        save: async () => richText(text),
        destroy: jest.fn(),
        clear: jest.fn(),
        render: jest.fn(),
        dangerouslyLowLevelInstance: {},
      }),
      [text],
    );

    return (
      <textarea
        aria-label="Translation"
        disabled={disabled}
        value={text}
        onChange={event => {
          setText(event.target.value);
          onChange?.(richText(event.target.value));
        }}
      />
    );
  },
}));

const props: ComponentProps<typeof TranslationFieldsRich> = {
  disabled: false,
  edit: true,
  initial: JSON.stringify(richText("Original translation")),
  saveButtonState: "default",
  resetKey: "DE",
  onDiscard: jest.fn(),
};

describe("TranslationFieldsRich", () => {
  const originalResizeObserver = global.ResizeObserver;

  beforeAll(() => {
    global.ResizeObserver = class implements ResizeObserver {
      observe = jest.fn<void, [Element, ResizeObserverOptions?]>();

      unobserve = jest.fn<void, [Element]>();

      disconnect = jest.fn<void, []>();
    };
  });

  afterAll(() => {
    global.ResizeObserver = originalResizeObserver;
  });

  it.each(["Unsaved translation", ""])(
    "preserves the draft %p through validation failure and retries the same value",
    async draft => {
      // Arrange
      const errors: Array<{ field: string; code: string }> = [{ field: "slug", code: "UNIQUE" }];
      const onSubmit = jest.fn(async (_data: OutputData): Promise<unknown[]> => errors);
      const { rerender } = render(<TranslationFieldsRich {...props} onSubmit={onSubmit} />);

      // Act
      fireEvent.change(screen.getByRole("textbox"), { target: { value: draft } });
      fireEvent.click(screen.getByTestId("button-bar-confirm"));
      await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
      rerender(
        <TranslationFieldsRich {...props} onSubmit={onSubmit} disabled saveButtonState="loading" />,
      );

      // Assert
      expect(screen.getByRole("textbox")).toBeDisabled();
      expect(screen.getByRole("textbox")).toHaveValue(draft);

      // Act
      rerender(<TranslationFieldsRich {...props} onSubmit={onSubmit} saveButtonState="error" />);

      // Assert
      expect(screen.getByRole("textbox")).toHaveValue(draft);
      expect(screen.getByRole("textbox")).toBeEnabled();

      // Act
      onSubmit.mockResolvedValueOnce([]);
      fireEvent.click(screen.getByTestId("button-bar-confirm"));

      // Assert
      await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(2));
      expect(onSubmit).toHaveBeenNthCalledWith(1, richText(draft));
      expect(onSubmit).toHaveBeenNthCalledWith(2, richText(draft));
    },
  );

  it("discards the old draft when the language reset key changes", () => {
    // Arrange
    const { rerender } = render(<TranslationFieldsRich {...props} />);

    // Act
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Unsaved German text" } });
    rerender(<TranslationFieldsRich {...props} resetKey="FR" />);

    // Assert
    expect(screen.getByRole("textbox")).toHaveValue("Original translation");
  });
});
