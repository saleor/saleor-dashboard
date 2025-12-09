import { render, screen } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import { MemoryRouter } from "react-router-dom";

import { TimelineEventHeader } from "./TimelineEventHeader";

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
    render(
      <TimelineEventHeader
        {...defaultProps}
        actorName="John Smith"
        actorType="user"
        actorId="user-123"
      />,
      { wrapper: Wrapper },
    );

    expect(screen.getByText(/by/)).toBeInTheDocument();
    expect(screen.getByText("John Smith")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/staff/user-123");
  });

  it("renders app attribution with link to app dashboard", () => {
    render(
      <TimelineEventHeader
        {...defaultProps}
        actorName="My App"
        actorType="app"
        actorId="QXBwOjI3OQ=="
      />,
      { wrapper: Wrapper },
    );

    expect(screen.getByText("My App")).toBeInTheDocument();

    const link = screen.getByRole("link", { name: "My App" });

    // ID should be URL-encoded (== becomes %3D%3D)
    expect(link).toHaveAttribute("href", "/extensions/app/QXBwOjI3OQ%3D%3D");
  });
});
