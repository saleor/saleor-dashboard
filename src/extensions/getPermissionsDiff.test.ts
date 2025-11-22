import { PermissionEnum } from "@dashboard/graphql";

import { getPermissionsDiff } from "./getPermissionsDiff";

describe("getPermissionsDiff", () => {
  describe("Correctly resolves added permissions", () => {
    test("From empty to one new", () => {
      const { added, removed } = getPermissionsDiff([], ["HANDLE_CHECKOUTS"]);

      expect(added).toEqual(["HANDLE_CHECKOUTS"]);
      expect(removed).toEqual([]);
    });
    test("From 0 to 3 new", () => {
      const { added, removed } = getPermissionsDiff(
        [],
        [
          "IMPERSONATE_USER",
          "HANDLE_PAYMENTS",
          "MANAGE_APPS",
        ],
      );

      expect(added).toEqual([
        "IMPERSONATE_USER",
        "HANDLE_PAYMENTS",
        "MANAGE_APPS",
      ]);
      expect(removed).toEqual([]);
    });
    test("From 1 to 2 new and 1 existing", () => {
      const { added, removed } = getPermissionsDiff(
        ["HANDLE_CHECKOUTS"],
        [
          "HANDLE_CHECKOUTS",
          "HANDLE_PAYMENTS",
          "MANAGE_APPS",
        ],
      );

      expect(added).toEqual(["HANDLE_PAYMENTS", "MANAGE_APPS"]);
      expect(removed).toEqual([]);
    });
  });
  describe("Correctly resolves removed permissions", () => {
    test("Doesnt remove anything if the same", () => {
      const { added, removed } = getPermissionsDiff(
        ["HANDLE_CHECKOUTS"],
        ["HANDLE_CHECKOUTS"],
      );

      expect(added).toEqual([]);
      expect(removed).toEqual([]);
    });
    test("Removes one", () => {
      const { added, removed } = getPermissionsDiff(["HANDLE_CHECKOUTS"], []);

      expect(added).toEqual([]);
      expect(removed).toEqual(["HANDLE_CHECKOUTS"]);
    });
  });
  test("Removes one and adds ", () => {
    const { added, removed } = getPermissionsDiff(
      ["HANDLE_CHECKOUTS", "HANDLE_PAYMENTS"],
      ["HANDLE_CHECKOUTS", "HANDLE_TAXES"],
    );

    expect(added).toEqual(["HANDLE_TAXES"]);
    expect(removed).toEqual(["HANDLE_PAYMENTS"]);
  });
});
