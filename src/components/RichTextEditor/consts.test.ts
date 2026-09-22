import { type ToolSettings } from "@editorjs/editorjs";

import { tools } from "./consts";

const imageTool = tools.image as ToolSettings;
const uploader = imageTool.config!.uploader;

describe("rich text image tool", () => {
  it("is offered in the toolbox", () => {
    // Assert
    expect(imageTool.toolbox).toBeUndefined();
  });

  it("asks for a url instead of opening a file picker", () => {
    // Arrange
    const ImageTool = imageTool.class as unknown as new (...args: never[]) => {
      askForUrl(): void;
      uploadUrl: jest.Mock;
    };
    const tool = Object.create(ImageTool.prototype);

    tool.uploadUrl = jest.fn();
    jest.spyOn(window, "prompt").mockReturnValue(" https://example.com/cat.png ");

    // Act
    tool.askForUrl();

    // Assert
    expect(tool.uploadUrl).toHaveBeenCalledWith("https://example.com/cat.png");
  });

  it("rejects file uploads", async () => {
    // Act
    const result = await uploader.uploadByFile(new Blob([], { type: "image/png" }));

    // Assert
    expect(result).toEqual({ success: 0, file: { url: "" } });
  });

  it("accepts an externally hosted image url", async () => {
    // Act
    const result = await uploader.uploadByUrl("https://example.com/cat.png");

    // Assert
    expect(result).toEqual({ success: 1, file: { url: "https://example.com/cat.png" } });
  });

  it.each(["data:image/png;base64,AAAA", "blob:http://localhost/abc", "javascript:alert(1)"])(
    "rejects non-http(s) source %s",
    async url => {
      // Act
      const result = await uploader.uploadByUrl(url);

      // Assert
      expect(result).toEqual({ success: 0, file: { url: "" } });
    },
  );

  it("does not handle pasted/dropped files", () => {
    // Act
    const pasteConfig = (imageTool.class as unknown as { pasteConfig: { files?: unknown } })
      .pasteConfig;

    // Assert
    expect(pasteConfig.files).toBeUndefined();
  });
});
