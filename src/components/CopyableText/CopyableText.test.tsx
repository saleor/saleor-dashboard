import { useClipboard } from "@dashboard/hooks/useClipboard";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CopyableText } from "./CopyableText";

jest.mock("@dashboard/hooks/useClipboard");

const mockUseClipboard = useClipboard as jest.MockedFunction<typeof useClipboard>;

describe("CopyableText", () => {
  it("copies provided text to clipboard when button is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const mockCopy = jest.fn();

    mockUseClipboard.mockReturnValue([false, mockCopy]);

    const textToCopy = "order-123-abc";

    render(
      <Wrapper>
        <CopyableText text={textToCopy} />
      </Wrapper>,
    );

    // Act
    const copyButton = screen.getByRole("button", { name: /copy to clipboard/i });

    await user.click(copyButton);

    // Assert
    expect(mockCopy).toHaveBeenCalledWith(textToCopy);
  });

  it("shows check icon after text is copied", () => {
    // Arrange
    mockUseClipboard.mockReturnValue([true, jest.fn()]);

    // Act
    render(
      <Wrapper>
        <CopyableText text="some-text" />
      </Wrapper>,
    );

    // Assert - when copied is true, CheckIcon should be shown
    const button = screen.getByRole("button", { name: /copy to clipboard/i });
    const checkIcon = button.querySelector(".lucide-check");

    expect(checkIcon).toBeInTheDocument();
  });

  it("shows copy icon when text has not been copied", () => {
    // Arrange
    mockUseClipboard.mockReturnValue([false, jest.fn()]);

    // Act
    render(
      <Wrapper>
        <CopyableText text="some-text" />
      </Wrapper>,
    );

    // Assert - when copied is false, CopyIcon should be shown
    const button = screen.getByRole("button", { name: /copy to clipboard/i });
    const copyIcon = button.querySelector(".lucide-copy");

    expect(copyIcon).toBeInTheDocument();
  });
});
