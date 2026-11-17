import { type ToolSettings } from "@editorjs/editorjs";
import { type IntlShape, type MessageDescriptor } from "react-intl";

import { tools } from "./consts";
import { getEditorI18n } from "./i18n";

const portuguese: Record<string, string> = {
  Add: "Adicionar",
  Heading: "Título",
  "Add a link": "Adicionar uma ligação",
  "Pasted link is not valid.": "A ligação colada não é válida.",
  "Add image by link": "Adicionar imagem por ligação",
  "Paste a link to an image": "Cole uma ligação para uma imagem",
  Embed: "Incorporar",
  "Open in new tab": "Abrir num novo separador",
  "Add embed by link": "Adicionar incorporação por ligação",
  "This link can't be embedded": "Não é possível incorporar esta ligação",
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
    // Arrange
    const intl = makeIntl(portuguese);

    // Act
    const messages = getEditorI18n(intl)!.messages!;

    // Assert
    expect(messages.ui).toMatchObject({
      toolbar: { toolbox: { Add: "Adicionar" } },
    });
    expect(messages.toolNames).toMatchObject({
      Heading: "Título",
      "Open in new tab": "Abrir num novo separador",
    });
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
    // Arrange
    const intl = makeIntl();

    // Act
    const messages = getEditorI18n(intl)!.messages!;

    // Assert
    expect(messages.toolNames).toMatchObject({
      Heading: "Heading",
      Image: "Image",
    });
    expect(messages.tools).toMatchObject({
      link: { "Add a link": "Add a link" },
    });
    expect(messages.blockTunes).toMatchObject({ delete: { Delete: "Delete" } });
  });

  it("translates the image and embed tools' own texts", () => {
    // Arrange
    const intl = makeIntl(portuguese);

    // Act
    const messages = getEditorI18n(intl)!.messages!;

    // Assert
    expect(messages.toolNames).toMatchObject({ Embed: "Incorporar" });
    expect(messages.tools).toMatchObject({
      image: {
        "Add image by link": "Adicionar imagem por ligação",
        "Paste a link to an image": "Cole uma ligação para uma imagem",
      },
      embed: {
        "Add embed by link": "Adicionar incorporação por ligação",
        "This link can't be embedded": "Não é possível incorporar esta ligação",
      },
    });
  });

  it("translates the external image URL prompt through the tool-scoped i18n API", () => {
    // Arrange
    const ImageTool = (tools.image as ToolSettings).class;

    if (!ImageTool) {
      throw new Error("Image tool class is missing");
    }

    const tool = Object.create(ImageTool.prototype);
    const translate = jest.fn(() => portuguese["Paste a link to an image"]);
    const prompt = jest.spyOn(window, "prompt").mockReturnValue(" https://example.com/image.png ");

    tool.editorApi = { i18n: { t: translate } };
    tool.uploadUrl = jest.fn();

    // Act
    tool.askForUrl();

    // Assert
    expect(translate).toHaveBeenCalledWith("Paste a link to an image");
    expect(prompt).toHaveBeenCalledWith("Cole uma ligação para uma imagem");
    expect(tool.uploadUrl).toHaveBeenCalledWith("https://example.com/image.png");
    prompt.mockRestore();
  });
});
