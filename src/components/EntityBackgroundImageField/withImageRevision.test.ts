import { withImageRevision } from "./withImageRevision";

describe("withImageRevision", () => {
  it("returns the original url when revision is zero", () => {
    // Arrange
    const url = "https://example.com/media/collection.jpg";

    // Act
    const result = withImageRevision(url, 0);

    // Assert
    expect(result).toBe(url);
  });

  it("appends a cache-busting query param", () => {
    // Arrange
    const url = "https://example.com/media/collection.jpg";

    // Act
    const result = withImageRevision(url, 2);

    // Assert
    expect(result).toBe("https://example.com/media/collection.jpg?v=2");
  });

  it("uses an ampersand when the url already has query params", () => {
    // Arrange
    const url = "https://example.com/media/collection.jpg?token=abc";

    // Act
    const result = withImageRevision(url, 1);

    // Assert
    expect(result).toBe("https://example.com/media/collection.jpg?token=abc&v=1");
  });
});
