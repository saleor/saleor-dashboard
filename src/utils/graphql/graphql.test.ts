import { shouldSkipFirstListFetchWithQuery } from "./graphql";

describe("Graphql utils", () => {
  describe("shouldSkipFirstListFetchWithQuery", () => {
    it("should return false if query is not present", () => {
      expect(shouldSkipFirstListFetchWithQuery()).toBe(false);
    });

    it("should return false if query is empty", () => {
      expect(shouldSkipFirstListFetchWithQuery("")).toBe(false);
    });

    it("should return false if query is present and sort is rank", () => {
      expect(shouldSkipFirstListFetchWithQuery("test", "rank")).toBe(false);
    });

    it("should return true if query is present and sort is not rank", () => {
      expect(shouldSkipFirstListFetchWithQuery("test", "name")).toBe(true);
    });
  });
});
