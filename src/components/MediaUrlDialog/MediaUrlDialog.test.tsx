import Wrapper from "@test/wrapper";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { MediaUrlDialog } from "./MediaUrlDialog";

const defaultProps = {
  open: true,
  onClose: jest.fn(),
  onSubmit: jest.fn().mockResolvedValue([]),
};

describe("MediaUrlDialog", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("submits url and closes dialog after upload completes", async () => {
    // Arrange
    const user = userEvent.setup();

    render(
      <Wrapper>
        <MediaUrlDialog {...defaultProps} />
      </Wrapper>,
    );

    const urlInput = screen.getByLabelText("URL");
    const submitButton = screen.getByRole("button", { name: "Upload URL" });

    // Assert
    expect(submitButton).toBeDisabled();
    await waitFor(() => {
      expect(urlInput).toHaveFocus();
    });

    // Act
    await user.type(urlInput, "https://example.com/image.jpg");
    await user.click(submitButton);

    // Assert
    await waitFor(() => {
      expect(defaultProps.onSubmit).toHaveBeenCalledWith("https://example.com/image.jpg");
    });
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("keeps dialog open when upload returns errors", async () => {
    // Arrange
    const user = userEvent.setup();
    const onSubmit = jest
      .fn()
      .mockResolvedValue([{ __typename: "ProductError", message: "Invalid URL" }]);

    render(
      <Wrapper>
        <MediaUrlDialog {...defaultProps} onSubmit={onSubmit} />
      </Wrapper>,
    );

    // Act
    await user.type(screen.getByLabelText("URL"), "https://example.com/image.jpg");
    await user.click(screen.getByTestId("submit"));

    // Assert
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  it("resets url field when reopened", async () => {
    // Arrange
    const user = userEvent.setup();
    const { rerender } = render(
      <Wrapper>
        <MediaUrlDialog {...defaultProps} />
      </Wrapper>,
    );

    await user.type(screen.getByLabelText("URL"), "https://example.com/image.jpg");

    // Act
    rerender(
      <Wrapper>
        <MediaUrlDialog {...defaultProps} open={false} />
      </Wrapper>,
    );
    rerender(
      <Wrapper>
        <MediaUrlDialog {...defaultProps} open={true} />
      </Wrapper>,
    );

    // Assert
    expect(screen.getByLabelText("URL")).toHaveValue("");
  });
});
