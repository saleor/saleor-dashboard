import getPublicationData from "./getPublicationData";

describe("getPublicationData", () => {
  it("keeps a visible page published", () => {
    // Arrange
    const data = { isPublished: true, publishedAt: null };

    // Act
    const result = getPublicationData(data);

    // Assert
    expect(result).toEqual({ isPublished: true, publishedAt: null });
  });

  it("keeps a hidden page without a date unpublished", () => {
    // Arrange
    const data = { isPublished: false, publishedAt: null };

    // Act
    const result = getPublicationData(data);

    // Assert
    expect(result).toEqual({ isPublished: false, publishedAt: null });
  });

  it("forces isPublished=true when a publication date is set so the page becomes visible once it passes", () => {
    // Arrange
    const data = { isPublished: false, publishedAt: "2099-01-01T00:00:00Z" };

    // Act
    const result = getPublicationData(data);

    // Assert
    expect(result).toEqual({
      isPublished: true,
      publishedAt: "2099-01-01T00:00:00Z",
    });
  });

  it("normalizes an empty publication date to null", () => {
    // Arrange
    const data = { isPublished: false, publishedAt: "" };

    // Act
    const result = getPublicationData(data);

    // Assert
    expect(result).toEqual({ isPublished: false, publishedAt: null });
  });
});
