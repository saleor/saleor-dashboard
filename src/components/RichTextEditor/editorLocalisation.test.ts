import { type ToolSettings } from "@editorjs/editorjs";
import { type IntlShape, type MessageDescriptor } from "react-intl";

import { getTools, tools } from "./consts";
import { editorMessages, getEditorI18n } from "./i18n";

const portuguese: Record<string, string> = {
  Add: "Adicionar",
  Heading: "Título",
  "Add a link": "Adicionar uma ligação",
  "Pasted link is not valid.": "A ligação colada não é válida.",
  "Add image by link": "Adicionar imagem por ligação",
  "Paste a link to an image": "Cole uma ligação para uma imagem",
  "Move up": "Mover para cima",
  "Start with": "Começar em",
  "Delete row": "Eliminar linha",
};

const makeIntl = (messages: Record<string, string> = {}) =>
  ({
    formatMessage: ({ defaultMessage }: MessageDescriptor) =>
      (typeof defaultMessage === "string" ? messages[defaultMessage] : undefined) ?? defaultMessage,
  }) as IntlShape;

describe("native editor localisation", () => {
  it("uses native dictionary namespaces for core UI, tools, names and block tunes", () => {
    const messages = getEditorI18n(makeIntl(portuguese))!.messages!;

    expect(messages.ui).toMatchObject({
      toolbar: { toolbox: { Add: "Adicionar" } },
    });
    expect(messages.toolNames).toMatchObject({ Heading: "Título" });
    expect(messages.tools).toMatchObject({
      link: {
        "Add a link": "Adicionar uma ligação",
        "Pasted link is not valid.": "A ligação colada não é válida.",
      },
      list: { "Start with": "Começar em" },
      table: { "Delete row": "Eliminar linha" },
    });
    expect(messages.blockTunes).toMatchObject({
      moveUp: { "Move up": "Mover para cima" },
    });
  });

  it("keeps English available through default messages", () => {
    const messages = getEditorI18n(makeIntl())!.messages!;

    expect(messages.toolNames).toMatchObject({
      Heading: "Heading",
      Image: "Image",
    });
    expect(messages.tools).toMatchObject({
      link: { "Add a link": "Add a link" },
    });
    expect(messages.blockTunes).toMatchObject({ delete: { Delete: "Delete" } });
  });

  it("localises image controls without mutating shared tools or adding content fields", () => {
    const translated = getTools(makeIntl(portuguese));
    const image = translated.image as ToolSettings;
    const originalImage = tools.image as ToolSettings;

    expect(image.config!.buttonContent).toBe("Adicionar imagem por ligação");
    expect(originalImage.config!.buttonContent).toBe("Add image by link");
    expect(image.class).toBe(originalImage.class);
    expect(image.config!.uploader).toBe(originalImage.config!.uploader);
    expect(Object.keys(image.config!)).toEqual(Object.keys(originalImage.config!));
  });

  it("translates the external image URL prompt through the tool-scoped i18n API", () => {
    const ImageTool = (tools.image as ToolSettings).class;

    if (!ImageTool) {
      throw new Error("Image tool class is missing");
    }

    const tool = Object.create(ImageTool.prototype);
    const translate = jest.fn(() => portuguese["Paste a link to an image"]);
    const prompt = jest.spyOn(window, "prompt").mockReturnValue(" https://example.com/image.png ");

    tool.imageI18n = { t: translate };
    tool.uploadUrl = jest.fn();
    tool.askForUrl();

    expect(translate).toHaveBeenCalledWith("Paste a link to an image");
    expect(prompt).toHaveBeenCalledWith("Cole uma ligação para uma imagem");
    expect(tool.uploadUrl).toHaveBeenCalledWith("https://example.com/image.png");
    prompt.mockRestore();
  });

  it("uses stable, unique Dashboard message IDs", () => {
    const ids = Object.values(editorMessages).map(message => message.id ?? "");

    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every(id => id.length > 0)).toBe(true);
  });
});
