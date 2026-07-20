import { isImageFileChoice } from "./isImageFileChoice";

describe("isImageFileChoice", () => {
  it("returns true for image content types", () => {
    // Arrange / Act / Assert
    expect(
      isImageFileChoice({
        __typename: "File",
        url: "https://example.com/file.bin",
        contentType: "image/png",
      }),
    ).toBe(true);
  });

  it("returns false for non-image content types", () => {
    // Arrange / Act / Assert
    expect(
      isImageFileChoice({
        __typename: "File",
        url: "https://example.com/doc.pdf",
        contentType: "application/pdf",
      }),
    ).toBe(false);
  });

  it("falls back to the URL extension when contentType is missing", () => {
    // Arrange / Act / Assert
    expect(
      isImageFileChoice({
        __typename: "File",
        url: "https://example.com/photo.JPEG?size=1",
        contentType: null,
      }),
    ).toBe(true);
    expect(
      isImageFileChoice({
        __typename: "File",
        url: "https://example.com/notes.pdf",
        contentType: null,
      }),
    ).toBe(false);
  });
});
