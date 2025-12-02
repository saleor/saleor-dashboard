import { render, screen } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import { MemoryRouter } from "react-router-dom";

import TimelineEventHeader, { TimelineApp, TimelineUser } from "./TimelineEventHeader";

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
    const user: TimelineUser = {
      id: "user-123",
      email: "john@example.com",
      firstName: "John",
      lastName: "Smith",
    };

    render(<TimelineEventHeader {...defaultProps} user={user} />, { wrapper: Wrapper });

    expect(screen.getByText(/by/)).toBeInTheDocument();
    expect(screen.getByText("John Smith")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/staff/user-123");
  });

  it("renders app attribution without link", () => {
    const app: TimelineApp = {
      id: "app-123",
      name: "My App",
    };

    render(<TimelineEventHeader {...defaultProps} app={app} />, { wrapper: Wrapper });

    expect(screen.getByText(/by.*My App/)).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
