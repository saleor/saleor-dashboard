import { AppUrls } from "@dashboard/new-apps/urls";

describe("AppUrls (apps/urls.ts)", () => {
  describe("isAppDeepUrlChange", () => {
    it("Returns true if only nested app path changes", () => {
      expect(
        AppUrls.isAppDeepUrlChange("XYZ", "/apps/XYZ/app/configuration", "/apps/XYZ/app/error"),
      ).toBe(true);
    });
    it("Returns false if dashboard path changes outside of app path", () => {
      expect(AppUrls.isAppDeepUrlChange("XYZ", "/apps/XYZ/configuration", "/orders")).toBe(false);
    });
  });
});
