import { ProductTypeKindEnum } from "@dashboard/graphql";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ProductTypeKindTiles } from "./ProductTypeKindTiles";

describe("ProductTypeKindTiles", () => {
  it("selects gift card kind", async () => {
    // Arrange
    const onChange = jest.fn();
    const user = userEvent.setup();

    render(<ProductTypeKindTiles value={ProductTypeKindEnum.NORMAL} onChange={onChange} />, {
      wrapper: Wrapper,
    });

    // Act
    await user.click(screen.getByTestId("GIFT_CARD"));

    // Assert
    expect(onChange).toHaveBeenCalledWith(ProductTypeKindEnum.GIFT_CARD);
  });

  it("marks the current kind as selected", () => {
    // Arrange & Act
    render(<ProductTypeKindTiles value={ProductTypeKindEnum.GIFT_CARD} onChange={jest.fn()} />, {
      wrapper: Wrapper,
    });

    // Assert
    expect(screen.getByTestId("GIFT_CARD")).toHaveAttribute("aria-checked", "true");
    expect(screen.getByTestId("NORMAL")).toHaveAttribute("aria-checked", "false");
    expect(screen.getByTestId("GIFT_CARD")).toHaveAttribute("tabIndex", "0");
    expect(screen.getByTestId("NORMAL")).toHaveAttribute("tabIndex", "-1");
  });

  it("moves selection with arrow keys", async () => {
    // Arrange
    const onChange = jest.fn();
    const user = userEvent.setup();

    render(<ProductTypeKindTiles value={ProductTypeKindEnum.NORMAL} onChange={onChange} />, {
      wrapper: Wrapper,
    });

    // Act
    screen.getByTestId("NORMAL").focus();
    await user.keyboard("{ArrowRight}");

    // Assert
    expect(onChange).toHaveBeenCalledWith(ProductTypeKindEnum.GIFT_CARD);
  });
});
