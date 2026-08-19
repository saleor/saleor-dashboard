import { TimelineAddNote } from "@dashboard/components/Timeline/Timeline";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { IntlProvider } from "react-intl";

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <IntlProvider locale="en" messages={{}}>
    {children}
  </IntlProvider>
);

describe("TimelineAddNote", () => {
  const defaultProps = {
    message: "",
    onChange: jest.fn(),
    onSubmit: jest.fn(),
    reset: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("disables submit button when message is empty", () => {
    render(<TimelineAddNote {...defaultProps} message="" />, { wrapper: Wrapper });

    const button = screen.getByRole("button");

    expect(button).toBeDisabled();
  });

  it("shows a default note hint when no label is provided", () => {
    // Arrange & Act
    render(<TimelineAddNote {...defaultProps} message="" />, { wrapper: Wrapper });

    // Assert — Macaw uses a floating label; without it the field looks empty
    expect(screen.getByText("Leave your note here...")).toBeInTheDocument();
  });

  it("uses an explicit label instead of the default hint", () => {
    // Arrange & Act
    render(<TimelineAddNote {...defaultProps} message="" label="Comment" />, {
      wrapper: Wrapper,
    });

    // Assert
    expect(screen.getByText("Comment")).toBeInTheDocument();
    expect(screen.queryByText("Leave your note here...")).not.toBeInTheDocument();
  });

  it("disables submit button when message is only whitespace", () => {
    render(<TimelineAddNote {...defaultProps} message="   " />, { wrapper: Wrapper });

    const button = screen.getByRole("button");

    expect(button).toBeDisabled();
  });

  it("enables submit button when message has content", () => {
    render(<TimelineAddNote {...defaultProps} message="Hello" />, { wrapper: Wrapper });

    const button = screen.getByRole("button");

    expect(button).not.toBeDisabled();
  });

  it("calls onSubmit and reset when button is clicked", async () => {
    const onSubmit = jest.fn();
    const reset = jest.fn();

    render(
      <TimelineAddNote {...defaultProps} message="Hello" onSubmit={onSubmit} reset={reset} />,
      { wrapper: Wrapper },
    );

    await userEvent.click(screen.getByRole("button"));

    expect(reset).toHaveBeenCalled();
    expect(onSubmit).toHaveBeenCalled();
  });

  it("does not submit when disabled prop is true", async () => {
    const onSubmit = jest.fn();

    render(<TimelineAddNote {...defaultProps} message="Hello" onSubmit={onSubmit} disabled />, {
      wrapper: Wrapper,
    });

    const button = screen.getByRole("button");

    expect(button).toBeDisabled();
  });
});
