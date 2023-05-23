import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import { ProductListDeleteButton } from "./ProductListDeleteButton";

vi.mock("react-intl", () => ({
  FormattedMessage: ({ defaultMessage }) => <>{defaultMessage}</>,
}));

describe("ProductListDeleteButton", () => {
  it("should return null when show is equal false", () => {
    // Arrange & Act
    const { container } = render(
      <ProductListDeleteButton show={false} onClick={vi.fn()} />,
    );

    // Assert
    expect(container).toBeEmptyDOMElement();
  });

  it("should render button", async () => {
    // Arrange & Act
    render(<ProductListDeleteButton show onClick={vi.fn()} />);

    // Assert
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should fire callback on click", async () => {
    // Arrange
    const onClick = vi.fn();

    // Act
    render(<ProductListDeleteButton show onClick={onClick} />);
    await userEvent.click(screen.getByRole("button"));

    // Assert
    expect(onClick).toHaveBeenCalled();
  });
});
