import { InstalledExtension } from "@dashboard/extensions/types";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { FormattedMessageProps } from "react-intl";

import { InstalledExtensionsList } from "./InstalledExtensionsList";

jest.mock("react-intl", () => ({
  useIntl: jest.fn(() => ({
    formatMessage: jest.fn(x => x.defaultMessage),
  })),
  defineMessages: jest.fn(x => x),
  FormattedMessage: ({ defaultMessage }: FormattedMessageProps) => <>{defaultMessage}</>,
}));

describe("InstalledExtensionsList", () => {
  it("should render loading state when loading is true", () => {
    // Arrange
    render(
      <InstalledExtensionsList installedExtensions={[]} loading={true} clearSearch={jest.fn()} />,
    );

    // Assert
    expect(screen.getByText("Extension Name")).toBeInTheDocument();
    expect(screen.getAllByTestId("loading-skeleton")).toHaveLength(10);
  });

  it("should render empty state when installed extensions length is 0", () => {
    // Arrange
    const clearSearch = jest.fn();

    render(
      <InstalledExtensionsList
        installedExtensions={[]}
        loading={false}
        clearSearch={clearSearch}
        searchQuery="test"
      />,
    );

    // Act
    fireEvent.click(screen.getByText("Clear search"));

    // Assert
    expect(screen.getByText("No extensions found")).toBeInTheDocument();
    expect(clearSearch).toBeCalledTimes(1);
  });

  it("should render installed extensions list", () => {
    // Arrange
    const installedExtensions = [
      { id: "1", name: "Extension 1" },
      { id: "2", name: "Extension 2" },
    ] as InstalledExtension[];

    render(
      <InstalledExtensionsList
        installedExtensions={installedExtensions}
        loading={false}
        clearSearch={jest.fn()}
      />,
    );

    // Assert
    expect(screen.getByText("Extension 1")).toBeInTheDocument();
    expect(screen.getByText("Extension 2")).toBeInTheDocument();
  });
});
