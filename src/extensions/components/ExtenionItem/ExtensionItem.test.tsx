import { render, screen } from "@testing-library/react";
import React from "react";
import { FormattedMessageProps } from "react-intl";

import { ExtensionItem } from "./ExtenionItem";

jest.mock("react-intl", () => ({
  useIntl: jest.fn(() => ({
    formatMessage: jest.fn(x => x.defaultMessage),
  })),
  defineMessages: jest.fn(x => x),
  FormattedMessage: ({ defaultMessage }: FormattedMessageProps) => <>{defaultMessage}</>,
}));

describe("Extensions / Components / ExtensionItem", () => {
  it("should render extension with actions", () => {
    // Arrange
    render(
      <ExtensionItem
        title="Avatax"
        description="Avatax description"
        avatarUrl="http://example.com"
        subtitle="Developed by Saleor"
        actions={
          <>
            <button>Install</button>
            <button>View on github</button>
          </>
        }
      />,
    );

    // Assert
    expect(screen.getByText("Avatax")).toBeInTheDocument();
    expect(screen.getByText("Avatax description")).toBeInTheDocument();
    expect(screen.getByText("Developed by Saleor")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Install" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "View on github" })).toBeInTheDocument();
    expect(screen.queryByText("Installed")).not.toBeInTheDocument();
  });

  it("should render installed extension with actions", () => {
    // Arrange
    render(
      <ExtensionItem
        isInstalled
        title="Avatax"
        description="Avatax description"
        avatarUrl="http://example.com"
        subtitle="Developed by Saleor"
        actions={
          <>
            <button>Install</button>
            <button>View on github</button>
          </>
        }
      />,
    );

    // Assert
    expect(screen.getByText("Avatax")).toBeInTheDocument();
    expect(screen.getByText("Avatax description")).toBeInTheDocument();
    expect(screen.getByText("Developed by Saleor")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Install" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "View on github" })).toBeInTheDocument();
    expect(screen.getByText("Installed")).toBeInTheDocument();
  });
});
