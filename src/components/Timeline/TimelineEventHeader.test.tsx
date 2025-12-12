import { render, screen } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import { MemoryRouter } from "react-router-dom";

import { TimelineEventHeader } from "./TimelineEventHeader";
import { Actor } from "./types";

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>
    <IntlProvider locale="en" messages={{}}>
      {children}
    </IntlProvider>
  </MemoryRouter>
);

describe("TimelineEventHeader", () => {
  const defaultProps = {
    date: "2024-06-15T14:30:00Z",
    title: "Test event",
  };

  it("renders title", () => {
    render(<TimelineEventHeader {...defaultProps} />, { wrapper: Wrapper });

    expect(screen.getByText("Test event")).toBeInTheDocument();
  });

  it("renders user attribution with link", () => {
    // Arrange
    const userActor: Actor = {
      type: "user",
      id: "user-123",
      email: "john@example.com",
      firstName: "John",
      lastName: "Smith",
    };

    // Act
    render(<TimelineEventHeader {...defaultProps} actor={userActor} />, { wrapper: Wrapper });

    // Assert
    expect(screen.getByText(/by/)).toBeInTheDocument();
    expect(screen.getByText("John Smith")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/staff/user-123");
  });

  it("renders app attribution with link to app dashboard", () => {
    // Arrange
    const appActor: Actor = {
      type: "app",
      id: "QXBwOjI3OQ==",
      name: "My App",
    };

    // Act
    render(<TimelineEventHeader {...defaultProps} actor={appActor} />, { wrapper: Wrapper });

    // Assert
    expect(screen.getByText("My App")).toBeInTheDocument();

    const link = screen.getByRole("link", { name: "My App" });

    // ID should be URL-encoded (== becomes %3D%3D)
    expect(link).toHaveAttribute("href", "/extensions/app/QXBwOjI3OQ%3D%3D");
  });
});
