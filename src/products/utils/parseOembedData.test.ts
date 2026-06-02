import { parseOembedData } from "./parseOembedData";

describe("parseOembedData", () => {
  it("returns empty object when oembed data is missing", () => {
    // Arrange & Act & Assert
    expect(parseOembedData(undefined)).toEqual({});
    expect(parseOembedData(null)).toEqual({});
    expect(parseOembedData("")).toEqual({});
  });

  it("parses valid oembed json", () => {
    // Arrange
    const oembedData = JSON.stringify({
      html: "<iframe></iframe>",
      thumbnail_url: "https://example.com/thumb.jpg",
    });

    // Act
    const result = parseOembedData(oembedData);

    // Assert
    expect(result.html).toBe("<iframe></iframe>");
    expect(result.thumbnail_url).toBe("https://example.com/thumb.jpg");
  });

  it("returns empty object for invalid json", () => {
    // Arrange & Act & Assert
    expect(parseOembedData("not-json")).toEqual({});
  });
});
