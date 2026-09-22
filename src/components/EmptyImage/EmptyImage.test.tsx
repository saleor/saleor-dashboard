import { ThemeProvider } from "@saleor/macaw-ui-next";
import { render, screen } from "@testing-library/react";

import { EmptyImage } from "./index";

describe("EmptyImage", () => {
  it("renders the image gallery icon instead of a filled placeholder", () => {
    // Arrange & Act
    render(
      <ThemeProvider>
        <EmptyImage />
      </ThemeProvider>,
    );

    // Assert
    expect(screen.getByTestId("empty-image")).toBeInTheDocument();
    expect(screen.getByTestId("empty-image").querySelector("svg")).toBeInTheDocument();
  });
});
