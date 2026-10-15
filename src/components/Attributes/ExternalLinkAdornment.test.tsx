import { render, screen } from "@testing-library/react";

import { ExternalLinkAdornment } from "./ExternalLinkAdornment";
import { isHttpUrl } from "./isHttpUrl";

describe("isHttpUrl", () => {
  it.each(["https://saleor.io", "http://localhost:8000/path?q=1", "HTTPS://Saleor.io/a"])(
    "should accept %s",
    value => {
      // Arrange / Act / Assert
      expect(isHttpUrl(value)).toBe(true);
    },
  );

  it.each([
    "",
    "saleor.io",
    "www.saleor.io",
    "ftp://saleor.io",
    "javascript:alert(1)",
    "mailto:hello@saleor.io",
    "see https://saleor.io",
    "https://",
  ])("should reject %s", value => {
    // Arrange / Act / Assert
    expect(isHttpUrl(value)).toBe(false);
  });
});

describe("ExternalLinkAdornment", () => {
  it("should render a link opening the URL in a new tab", () => {
    // Arrange / Act
    render(<ExternalLinkAdornment value="https://saleor.io/docs" />);

    // Assert
    const link = screen.getByTestId("external-link-adornment");

    expect(link).toHaveAttribute("href", "https://saleor.io/docs");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("should ignore spaces around the link", () => {
    // Arrange / Act
    render(<ExternalLinkAdornment value="  https://saleor.io  " />);

    // Assert
    expect(screen.getByTestId("external-link-adornment")).toHaveAttribute(
      "href",
      "https://saleor.io",
    );
  });

  it("should render nothing for text that is not a link", () => {
    // Arrange / Act
    const { container } = render(<ExternalLinkAdornment value="saleor.io" />);

    // Assert
    expect(container).toBeEmptyDOMElement();
  });
});
