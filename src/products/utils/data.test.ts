import { getSelectedMedia } from "./data";

type GetSelectedMediaParams = Parameters<typeof getSelectedMedia>;

describe("Product media utils", () => {
  it("should return selected media in proper order when media ids passed", () => {
    // Arrange
    const media: GetSelectedMediaParams[0] = [
      {
        id: "1",
        sortOrder: 2,
      },
      {
        id: "2",
        sortOrder: 3,
      },
      {
        id: "3",
        sortOrder: 4,
      },
      {
        id: "4",
        sortOrder: 1,
      },
    ];
    const selectedIds: GetSelectedMediaParams[1] = ["1", "3", "4"];
    // Act
    const result = getSelectedMedia(media, selectedIds);
    // Assert
    const expectedResult = [
      {
        id: "4",
        sortOrder: 1,
      },
      {
        id: "1",
        sortOrder: 2,
      },
      {
        id: "3",
        sortOrder: 4,
      },
    ];

    expect(result).toEqual(expectedResult);
  });
  it("should return empty array of media when no media ids passed", () => {
    // Arrange
    const media: GetSelectedMediaParams[0] = [
      {
        id: "1",
        sortOrder: 2,
      },
      {
        id: "2",
        sortOrder: 3,
      },
      {
        id: "3",
        sortOrder: 4,
      },
      {
        id: "4",
        sortOrder: 1,
      },
    ];
    const selectedIds: GetSelectedMediaParams[1] = [];
    // Act
    const result = getSelectedMedia(media, selectedIds);

    // Assert
    expect(result).toEqual([]);
  });
});
