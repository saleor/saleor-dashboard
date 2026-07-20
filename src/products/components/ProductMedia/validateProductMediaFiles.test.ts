import {
  PRODUCT_MEDIA_MAX_FILE_SIZE_BYTES,
  validateProductMediaFiles,
} from "./validateProductMediaFiles";

describe("validateProductMediaFiles", () => {
  it("accepts image files under the size limit", () => {
    // Arrange
    const file = new File(["bytes"], "photo.png", { type: "image/png" });

    // Act
    const result = validateProductMediaFiles([file]);

    // Assert
    expect(result.validFiles).toEqual([file]);
    expect(result.rejected).toEqual([]);
  });

  it("rejects non-image files", () => {
    // Arrange
    const file = new File(["bytes"], "notes.pdf", { type: "application/pdf" });

    // Act
    const result = validateProductMediaFiles([file]);

    // Assert
    expect(result.validFiles).toEqual([]);
    expect(result.rejected).toEqual([{ file, reason: "invalidType" }]);
  });

  it("rejects files over the size limit", () => {
    // Arrange
    const largeContent = new Uint8Array(PRODUCT_MEDIA_MAX_FILE_SIZE_BYTES + 1);
    const file = new File([largeContent], "huge.png", { type: "image/png" });

    // Act
    const result = validateProductMediaFiles([file]);

    // Assert
    expect(result.validFiles).toEqual([]);
    expect(result.rejected).toEqual([{ file, reason: "tooLarge" }]);
  });

  it("accepts images with an empty mime type when the extension is known", () => {
    // Arrange
    const file = new File(["bytes"], "photo.JPEG", { type: "" });

    // Act
    const result = validateProductMediaFiles([file]);

    // Assert
    expect(result.validFiles).toEqual([file]);
    expect(result.rejected).toEqual([]);
  });
});
