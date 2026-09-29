import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { PaginationButtons } from "./PaginationButtons";

describe("PaginationButtons", () => {
  it("uses the small secondary page arrows", async () => {
    // Arrange
    const onPreviousPage = jest.fn();
    const onNextPage = jest.fn();

    render(
      <Wrapper>
        <PaginationButtons
          hasPreviousPage={false}
          hasNextPage
          onPreviousPage={onPreviousPage}
          onNextPage={onNextPage}
        />
      </Wrapper>,
    );

    const previous = screen.getByRole("button", { name: "Previous page" });
    const next = screen.getByRole("button", { name: "Next page" });

    // Act
    await userEvent.click(previous);
    await userEvent.click(next);

    // Assert
    expect(previous).toBeDisabled();
    expect(next).toBeEnabled();
    expect(onPreviousPage).not.toHaveBeenCalled();
    expect(onNextPage).toHaveBeenCalledTimes(1);
  });
});
