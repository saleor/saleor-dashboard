import { getGiftCardTagsAddRemoveData } from "./GiftCardUpdateFormProvider";

describe("getGiftCardTagsAddRemoveData", () => {
  it("returns added and removed tags", () => {
    // Arrange
    const initTags = ["vip", "holiday"];
    const changedTags = ["holiday", "promo"];

    // Act
    const result = getGiftCardTagsAddRemoveData(initTags, changedTags);

    // Assert
    expect(result).toEqual({
      addTags: ["promo"],
      removeTags: ["vip"],
    });
  });

  it("returns empty arrays when no changes", () => {
    // Arrange
    const tags = ["vip", "holiday"];

    // Act
    const result = getGiftCardTagsAddRemoveData(tags, tags);

    // Assert
    expect(result).toEqual({
      addTags: [],
      removeTags: [],
    });
  });

  it("returns all as added when init is empty", () => {
    // Arrange & Act
    const result = getGiftCardTagsAddRemoveData([], ["vip", "promo"]);

    // Assert
    expect(result).toEqual({
      addTags: ["vip", "promo"],
      removeTags: [],
    });
  });

  it("returns all as removed when changed is empty", () => {
    // Arrange & Act
    const result = getGiftCardTagsAddRemoveData(["vip", "promo"], []);

    // Assert
    expect(result).toEqual({
      addTags: [],
      removeTags: ["vip", "promo"],
    });
  });
});
