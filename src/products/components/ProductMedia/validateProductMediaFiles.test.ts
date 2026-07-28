import { validateProductMediaFiles } from "./validateProductMediaFiles";

describe("validateProductMediaFiles", () => {
  it("accepts image files", () => {
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

  it("does not reject large image files (size is enforced by Core)", () => {
    // Arrange — larger than Core's default 10 MiB; Cloud/prod may allow more
    const largeContent = new Uint8Array(20 * 1024 * 1024);
    const file = new File([largeContent], "huge.png", { type: "image/png" });

    // Act
    const result = validateProductMediaFiles([file]);

    // Assert
    expect(result.validFiles).toEqual([file]);
    expect(result.rejected).toEqual([]);
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
