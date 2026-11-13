import { isSectionDownloadFailure } from "./sectionDownloadFailure";

describe("isSectionDownloadFailure", () => {
  it.each([
    ["Chrome", new TypeError("Failed to fetch dynamically imported module: /assets/customers.js")],
    ["Firefox", new TypeError("error loading dynamically imported module: /assets/customers.js")],
    ["Safari", new TypeError("Importing a module script failed.")],
    ["Vite", new Error("Unable to preload CSS for /assets/customers.css")],
  ])("recognises a failed download in %s", (_browser, error) => {
    // Arrange & Act
    const failed = isSectionDownloadFailure(error);

    // Assert
    expect(failed).toBe(true);
  });

  it.each([
    [
      "an error thrown by the downloaded code",
      new TypeError("Cannot read properties of undefined"),
    ],
    ["a failed API request", new TypeError("Failed to fetch")],
    ["something that isn't an error", "Failed to fetch dynamically imported module"],
  ])("doesn't take %s for one", (_name, error) => {
    // Arrange & Act
    const failed = isSectionDownloadFailure(error);

    // Assert
    expect(failed).toBe(false);
  });
});
