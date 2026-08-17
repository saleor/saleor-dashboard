import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import { type ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

import { CatalogProductThumbnailStack } from "./CatalogProductThumbnailStack";

const RouterWrapper = ({ children }: { children: ReactNode }) => (
  <MemoryRouter>
    <Wrapper>{children}</Wrapper>
  </MemoryRouter>
);

describe("CatalogProductThumbnailStack", () => {
  it("links each thumbnail to its product so it can be opened in a new tab", () => {
    // Arrange & Act
    render(
      <CatalogProductThumbnailStack
        products={[{ id: "UHJvZHVjdDox", name: "Sneaker", thumbnailUrl: null }]}
      />,
      { wrapper: RouterWrapper },
    );

    // Assert
    expect(screen.getByTestId("recently-published-thumbnail-UHJvZHVjdDox")).toHaveAttribute(
      "href",
      expect.stringContaining("UHJvZHVjdDox"),
    );
  });

  it("renders overlapping thumbnails for recent products", () => {
    // Arrange & Act
    render(
      <CatalogProductThumbnailStack
        products={[
          { id: "UHJvZHVjdDox", name: "Sneaker", thumbnailUrl: "https://example.com/sneaker.jpg" },
          { id: "UHJvZHVjdDoy", name: "T-Shirt", thumbnailUrl: "https://example.com/tshirt.jpg" },
          { id: "UHJvZHVjdDoz", name: "Hat", thumbnailUrl: null },
        ]}
      />,
      { wrapper: RouterWrapper },
    );

    // Assert
    expect(screen.getByTestId("recently-published-thumbnails")).toBeInTheDocument();
    expect(screen.getByTestId("recently-published-thumbnail-UHJvZHVjdDox")).toHaveAttribute(
      "title",
      "Sneaker",
    );
    expect(
      screen.getByTestId("recently-published-thumbnail-UHJvZHVjdDox").querySelector("img"),
    ).toHaveAttribute("src", "https://example.com/sneaker.jpg");
  });

  it("renders nothing when there are no products", () => {
    // Arrange & Act
    render(<CatalogProductThumbnailStack products={[]} />, {
      wrapper: RouterWrapper,
    });

    // Assert
    expect(screen.queryByTestId("recently-published-thumbnails")).not.toBeInTheDocument();
  });
});
