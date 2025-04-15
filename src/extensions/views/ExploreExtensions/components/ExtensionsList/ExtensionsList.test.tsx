import { ExtensionsGroups } from "@dashboard/extensions/types";
import { render, screen } from "@testing-library/react";
import React from "react";

import { ExtensionsList } from "./ExtensionsList";

jest.mock("react-intl", () => ({
  useIntl: jest.fn(() => ({
    formatMessage: jest.fn(x => x.defaultMessage),
  })),
  defineMessages: jest.fn(x => x),
}));

jest.mock("@saleor/macaw-ui-next", () => ({
  ...(jest.requireActual("@saleor/macaw-ui-next") as object),
  useTheme: () => ({ theme: "default" }),
}));

describe("Extensions / Components / ExtensionsList", () => {
  it("should render loading skeleton when loading", () => {
    // Arrange
    const extensions = {
      group1: {
        title: "Group 1",
        items: [],
      },
      group2: {
        title: "Group 2",
        items: [],
      },
    } as unknown as ExtensionsGroups;

    // Act
    render(<ExtensionsList clearSearch={jest.fn()} extensions={extensions} loading />);

    // Assert
    expect(screen.getByTestId("extensions-loading-skeleton")).toBeInTheDocument();
  });

  it("should render empty search list when all extensions are empty", () => {
    // Arrange
    const extensions = {
      group1: {
        title: "Group 1",
        items: [],
      },
      group2: {
        title: "Group 2",
        items: [],
      },
    } as unknown as ExtensionsGroups;

    // Act
    render(<ExtensionsList clearSearch={jest.fn()} extensions={extensions} />);

    // Assert
    expect(screen.getByTestId("empty-search-list")).toBeInTheDocument();
  });

  it("should allow to clear search when empty search list is rendered", () => {
    // Arrange
    const extensions = {
      group1: {
        title: "Group 1",
        items: [],
      },
      group2: {
        title: "Group 2",
        items: [],
      },
    } as unknown as ExtensionsGroups;
    const clearSearch = jest.fn();

    render(<ExtensionsList clearSearch={clearSearch} extensions={extensions} />);

    // Act
    screen.getByText("Clear search").click();

    // Assert
    expect(clearSearch).toHaveBeenCalled();
  });

  it("should render extensions list", () => {
    // Arrange
    const extensions = {
      group1: {
        title: "Group 1",
        items: [
          {
            id: "1",
            name: {
              en: "Extension 1",
            },
          },
        ],
      },
      group2: {
        title: "Group 2",
        items: [
          {
            id: "2",
            name: {
              en: "Extension 2",
            },
          },
        ],
      },
    } as unknown as ExtensionsGroups;

    // Act
    render(<ExtensionsList clearSearch={jest.fn()} extensions={extensions} />);

    // Assert
    expect(screen.getByText("Group 1")).toBeInTheDocument();
    expect(screen.getByText("Extension 1")).toBeInTheDocument();
    expect(screen.getByText("Group 2")).toBeInTheDocument();
    expect(screen.getByText("Extension 2")).toBeInTheDocument();
  });
});
