import { render, screen } from "@testing-library/react";

import { AppWidgets } from "./AppWidgets";

const getState = jest.fn();

jest.mock("@dashboard/extensions/preferences/useExtensionPreferences", () => ({
  useExtensionPreferences: () => ({ getState, setState: jest.fn(), isSaving: false }),
}));

// Render the extension item as its label so we can assert order/visibility.
jest.mock("./AppWidgetExtensionItem", () => ({
  AppWidgetExtensionItem: ({ extension }: { extension: { label: string } }) => (
    <div>{extension.label}</div>
  ),
}));

const makeExt = (id: string, label: string) => ({
  id,
  identifier: id,
  label,
  targetName: "WIDGET",
  app: { id: "app", identifier: "app", name: "App", appUrl: "https://x" },
});

describe("AppWidgets preference enforcement", () => {
  beforeEach(() => getState.mockReset());

  it("hides extensions marked hidden", () => {
    // Arrange
    getState.mockImplementation((e: { id: string }) => (e.id === "b" ? "hidden" : "default"));

    const extensions = [makeExt("a", "Alpha"), makeExt("b", "Beta")];

    // Act
    render(<AppWidgets extensions={extensions as never} params={{} as never} />);

    // Assert
    expect(screen.queryByText("Beta")).not.toBeInTheDocument();
    expect(screen.getByText("Alpha")).toBeInTheDocument();
  });
});
