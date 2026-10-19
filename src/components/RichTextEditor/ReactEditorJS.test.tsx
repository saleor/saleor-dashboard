import { type OutputData } from "@editorjs/editorjs";
import { type EditorCore } from "@react-editor-js/core";
import { act, render } from "@testing-library/react";
import { StrictMode } from "react";

import { ReactEditorJS } from "./ReactEditorJS";

let mockReady: Promise<void>;
let resolveReady: () => void;
let rejectReady: (error: Error) => void;
const mockRender = jest.fn<Promise<void>, [OutputData]>(() => Promise.resolve());

jest.mock("@editorjs/editorjs", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    isReady: mockReady,
    render: mockRender,
    destroy: jest.fn(),
  })),
}));

jest.mock("@editorjs/paragraph", () => ({ __esModule: true, default: jest.fn() }));

const loadedContent: OutputData = {
  blocks: [{ type: "paragraph", data: { text: "Loaded translation" } }],
};

describe("ReactEditorJS", () => {
  beforeEach(() => {
    const ready = Promise.withResolvers<void>();

    mockReady = ready.promise;
    resolveReady = ready.resolve;
    rejectReady = ready.reject;
    mockRender.mockClear();
  });

  afterEach(() => {
    resolveReady();
  });

  it("waits for initialization before rendering asynchronously loaded content in StrictMode", async () => {
    // Arrange
    const onInitialize = jest.fn<void, [EditorCore]>();

    render(
      <StrictMode>
        <ReactEditorJS defaultValue={{ blocks: [] }} onInitialize={onInitialize} />
      </StrictMode>,
    );

    const editor = onInitialize.mock.calls[0][0];

    // Act
    const rendering = editor.render(loadedContent);

    try {
      // Assert
      expect(mockRender).not.toHaveBeenCalled();
    } finally {
      resolveReady();
      await rendering;
    }

    // Assert
    expect(mockRender).toHaveBeenCalledTimes(1);
    expect(mockRender).toHaveBeenCalledWith(loadedContent);
  });

  it("applies a value received while the editor is still initializing", async () => {
    // Arrange
    const { rerender } = render(<ReactEditorJS defaultValue={{ blocks: [] }} />);

    // Act
    rerender(<ReactEditorJS value={loadedContent} />);

    // Assert
    expect(mockRender).not.toHaveBeenCalled();

    // Act
    await act(async () => {
      resolveReady();
      await mockReady;
    });

    // Assert
    expect(mockRender).toHaveBeenCalledTimes(1);
    expect(mockRender).toHaveBeenCalledWith(loadedContent);
  });

  it("rejects rendering without applying content when initialization fails", async () => {
    // Arrange
    const onInitialize = jest.fn<void, [EditorCore]>();
    const error = new Error("Editor initialization failed");

    render(<ReactEditorJS onInitialize={onInitialize} />);

    const editor = onInitialize.mock.calls[0][0];

    // Act
    const rendering = editor.render(loadedContent);
    const rejection = expect(rendering).rejects.toBe(error);

    rejectReady(error);

    // Assert
    await rejection;
    expect(mockRender).not.toHaveBeenCalled();
  });
});
