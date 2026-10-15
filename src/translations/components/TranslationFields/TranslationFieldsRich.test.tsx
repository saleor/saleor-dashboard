import { type RichTextEditorProps } from "@dashboard/components/RichTextEditor/RichTextEditor";
import { type EditorConfig, type OutputData } from "@editorjs/editorjs";
import { type EditorCore } from "@react-editor-js/core";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { type ComponentProps, StrictMode, useImperativeHandle, useState } from "react";

import TranslationFieldsRich from "./TranslationFieldsRich";

const richText = (text: string): OutputData => ({
  blocks: [{ type: "paragraph", data: { text } }],
});

jest.mock("@editorjs/editorjs", () => ({
  __esModule: true,
  default: jest.fn(({ holder, data }: EditorConfig) => {
    const element =
      typeof holder === "string" ? document.querySelector(`[id="${holder}"]`) : holder;
    const content = document.createElement("div");
    const display = (value?: OutputData): void => {
      content.textContent = value?.blocks.map(block => block.data.text).join(" ") ?? "";
    };

    // Editor.js consumes initial data on construction; later updates require render().
    display(data);
    element?.append(content);

    return {
      isReady: Promise.resolve(),
      destroy: (): void => content.remove(),
      render: async (value: OutputData): Promise<void> => display(value),
    };
  }),
}));

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

  it("shows block-only JSON loaded after the preview mounts in StrictMode", async () => {
    // Arrange
    const { rerender } = render(
      <StrictMode>
        <TranslationFieldsRich {...props} edit={false} initial="" />
      </StrictMode>,
    );

    // Act
    rerender(
      <StrictMode>
        <TranslationFieldsRich
          {...props}
          edit={false}
          initial={JSON.stringify(richText("Loaded translation"))}
        />
      </StrictMode>,
    );

    // Assert
    expect(await screen.findByText("Loaded translation")).toBeVisible();
  });

  it.each([undefined, 1234])(
    "updates the preview when content changes and time stays %p",
    async time => {
      // Arrange
      const initial: OutputData = { ...richText("Original translation"), time };
      const updated: OutputData = { ...richText("Updated translation"), time };
      const { rerender } = render(
        <TranslationFieldsRich {...props} edit={false} initial={JSON.stringify(initial)} />,
      );

      expect(await screen.findByText("Original translation")).toBeVisible();

      // Act
      rerender(<TranslationFieldsRich {...props} edit={false} initial={JSON.stringify(updated)} />);

      // Assert
      expect(await screen.findByText("Updated translation")).toBeVisible();
      expect(screen.queryByText("Original translation")).not.toBeInTheDocument();
    },
  );

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
