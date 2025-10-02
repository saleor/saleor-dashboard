import { OutputData } from "@editorjs/editorjs";

import { convertEditorJSListBlocks } from "./utils";

describe("convertEditorJSListBlocks", () => {
  it("should convert new format list items (objects) to legacy format (strings)", () => {
    // Arrange
    const inputData: OutputData = {
      time: 1234567890,
      blocks: [
        {
          id: "list-1",
          type: "list",
          data: {
            style: "unordered",
            items: [
              { content: "Item 1", meta: {} },
              { content: "Item 2", meta: {} },
              { content: "Item 3", meta: {} },
            ],
          },
        },
      ],
      version: "2.0.0",
    };

    // Act
    const result = convertEditorJSListBlocks(inputData);

    // Assert
    expect(result.blocks[0].data).toEqual({
      style: "unordered",
      items: ["Item 1", "Item 2", "Item 3"],
    });
  });

  it("should handle ordered lists", () => {
    // Arrange
    const inputData: OutputData = {
      time: 1234567890,
      blocks: [
        {
          id: "list-1",
          type: "list",
          data: {
            style: "ordered",
            items: [
              { content: "First", meta: {} },
              { content: "Second", meta: {} },
            ],
          },
        },
      ],
      version: "2.0.0",
    };

    // Act
    const result = convertEditorJSListBlocks(inputData);

    // Assert
    expect(result.blocks[0].data).toEqual({
      style: "ordered",
      items: ["First", "Second"],
    });
  });

  it("should not modify lists already in legacy format", () => {
    // Arrange
    const inputData: OutputData = {
      time: 1234567890,
      blocks: [
        {
          id: "list-1",
          type: "list",
          data: {
            style: "unordered",
            items: ["Legacy Item 1", "Legacy Item 2"],
          },
        },
      ],
      version: "1.0.0",
    };

    // Act
    const result = convertEditorJSListBlocks(inputData);

    // Assert
    expect(result.blocks[0].data).toEqual({
      style: "unordered",
      items: ["Legacy Item 1", "Legacy Item 2"],
    });
  });

  it("should not modify non-list blocks", () => {
    // Arrange
    const inputData: OutputData = {
      time: 1234567890,
      blocks: [
        {
          id: "paragraph-1",
          type: "paragraph",
          data: {
            text: "This is a paragraph",
          },
        },
        {
          id: "header-1",
          type: "header",
          data: {
            text: "This is a header",
            level: 2,
          },
        },
      ],
      version: "2.0.0",
    };

    // Act
    const result = convertEditorJSListBlocks(inputData);

    // Assert
    expect(result.blocks).toEqual(inputData.blocks);
  });

  it("should handle mixed block types", () => {
    // Arrange
    const inputData: OutputData = {
      time: 1234567890,
      blocks: [
        {
          id: "paragraph-1",
          type: "paragraph",
          data: { text: "Intro paragraph" },
        },
        {
          id: "list-1",
          type: "list",
          data: {
            style: "unordered",
            items: [
              { content: "New format item 1", meta: {} },
              { content: "New format item 2", meta: {} },
            ],
          },
        },
        {
          id: "paragraph-2",
          type: "paragraph",
          data: { text: "Conclusion paragraph" },
        },
      ],
      version: "2.0.0",
    };

    // Act
    const result = convertEditorJSListBlocks(inputData);

    // Assert
    expect(result.blocks[0]).toEqual(inputData.blocks[0]);
    expect(result.blocks[1].data).toEqual({
      style: "unordered",
      items: ["New format item 1", "New format item 2"],
    });
    expect(result.blocks[2]).toEqual(inputData.blocks[2]);
  });

  it("should handle empty list items array", () => {
    // Arrange
    const inputData: OutputData = {
      time: 1234567890,
      blocks: [
        {
          id: "list-1",
          type: "list",
          data: {
            style: "unordered",
            items: [],
          },
        },
      ],
      version: "2.0.0",
    };

    // Act
    const result = convertEditorJSListBlocks(inputData);

    // Assert
    expect(result.blocks[0].data).toEqual({
      style: "unordered",
      items: [],
    });
  });

  it("should preserve other properties of OutputData", () => {
    // Arrange
    const inputData: OutputData = {
      time: 1234567890,
      blocks: [
        {
          id: "list-1",
          type: "list",
          data: {
            style: "unordered",
            items: [{ content: "Item 1", meta: {} }],
          },
        },
      ],
      version: "2.0.0",
    };

    // Act
    const result = convertEditorJSListBlocks(inputData);

    // Assert
    expect(result.time).toBe(inputData.time);
    expect(result.version).toBe(inputData.version);
  });

  it("should handle multiple list blocks in one document", () => {
    // Arrange
    const inputData: OutputData = {
      time: 1234567890,
      blocks: [
        {
          id: "list-1",
          type: "list",
          data: {
            style: "ordered",
            items: [
              { content: "First list item 1", meta: {} },
              { content: "First list item 2", meta: {} },
            ],
          },
        },
        {
          id: "list-2",
          type: "list",
          data: {
            style: "unordered",
            items: [
              { content: "Second list item 1", meta: {} },
              { content: "Second list item 2", meta: {} },
            ],
          },
        },
      ],
      version: "2.0.0",
    };

    // Act
    const result = convertEditorJSListBlocks(inputData);

    // Assert
    expect(result.blocks[0].data).toEqual({
      style: "ordered",
      items: ["First list item 1", "First list item 2"],
    });
    expect(result.blocks[1].data).toEqual({
      style: "unordered",
      items: ["Second list item 1", "Second list item 2"],
    });
  });
});
