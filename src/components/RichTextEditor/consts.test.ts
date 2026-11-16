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

describe("rich text embed tool", () => {
  type EmbedTool = {
    askForUrl(): void;
    render(): HTMLElement;
    save(): { service?: string; source?: string; embed?: string };
    validate(data: { service?: string }): boolean;
  };
  type EmbedToolClass = {
    new (args: { data: object; api: object; readOnly: boolean }): EmbedTool;
    prepare(args: { config: object }): void;
    toolbox: { title: string };
  };

  const EmbedToolClass = tools.embed as unknown as EmbedToolClass;

  const createTool = ({ readOnly = false }: { readOnly?: boolean } = {}): {
    tool: EmbedTool;
    notifier: { show: jest.Mock };
  } => {
    const notifier = { show: jest.fn() };
    const api = { notifier, styles: { block: "block", input: "input", button: "cdx-button" } };

    EmbedToolClass.prepare({ config: {} });

    return { tool: new EmbedToolClass({ data: {}, api, readOnly }), notifier };
  };

  it("is offered in the toolbox", () => {
    // Assert
    expect(EmbedToolClass.toolbox.title).toBe("Embed");
  });

  it("embeds a YouTube link entered in the prompt", () => {
    // Arrange
    const { tool } = createTool();

    jest.spyOn(window, "prompt").mockReturnValue(" https://www.youtube.com/watch?v=dQw4w9WgXcQ ");

    // Act
    tool.askForUrl();

    // Assert
    expect(tool.save()).toMatchObject({
      service: "youtube",
      source: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      embed: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    });
  });

  it("shows an error for a link no service can embed", () => {
    // Arrange
    const { tool, notifier } = createTool();

    jest.spyOn(window, "prompt").mockReturnValue("https://example.com/page");

    // Act
    tool.askForUrl();

    // Assert
    expect(notifier.show).toHaveBeenCalledWith(expect.objectContaining({ style: "error" }));
    expect(tool.validate(tool.save())).toBe(false);
  });

  it("shows an add button while empty, but not in read-only mode", () => {
    // Act
    const editable = createTool().tool.render();
    const readOnly = createTool({ readOnly: true }).tool.render();

    // Assert
    expect(editable.querySelector(".cdx-button")).not.toBeNull();
    expect(readOnly.querySelector(".cdx-button")).toBeNull();
  });
});
