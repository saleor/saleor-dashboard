import { EMPTY_EDITOR_DATA, parseEditorData } from "./parseEditorData";

describe("parseEditorData", () => {
  it("returns empty editor data when the value is missing", () => {
    // Arrange / Act / Assert
    expect(parseEditorData(undefined)).toStrictEqual(EMPTY_EDITOR_DATA);
    expect(parseEditorData(null)).toStrictEqual(EMPTY_EDITOR_DATA);
    expect(parseEditorData("")).toStrictEqual(EMPTY_EDITOR_DATA);
  });

  it("returns parsed OutputData for valid JSON", () => {
    // Arrange
    const data = { blocks: [{ type: "paragraph", data: { text: "Hi" } }] };

    // Act / Assert
    expect(parseEditorData(JSON.stringify(data))).toStrictEqual(data);
  });

  it("returns empty editor data when JSON cannot be parsed", () => {
    // Arrange / Act / Assert
    expect(parseEditorData("this-isnt-valid-json")).toStrictEqual(EMPTY_EDITOR_DATA);
  });
});
