import { render } from "@testing-library/react";

import { WindowTitle } from ".";

jest.mock("@dashboard/hooks/useShop", () => ({
  __esModule: true,
  default: () => ({ name: "Shop" }),
}));

describe("WindowTitle", () => {
  it("lets the innermost title win and restores the outer one on unmount", () => {
    // Arrange
    const { rerender } = render(
      <>
        <WindowTitle title="Customers" />
        <WindowTitle title="John Doe" />
      </>,
    );

    // Assert
    expect(document.title).toBe("John Doe | Shop");

    // Act
    rerender(
      <>
        <WindowTitle title="Customers" />
      </>,
    );

    // Assert
    expect(document.title).toBe("Customers | Shop");
  });
});
