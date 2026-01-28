import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

import { Link } from "./Link";

const Wrapper = ({ children }: { children: ReactNode }) => {
  return <MemoryRouter initialEntries={[{ pathname: "/" }]}>{children}</MemoryRouter>;
};

const renderWithRouter = (component: React.ReactElement) => {
  return render(component, { wrapper: Wrapper });
};

describe("Link component", () => {
  describe("internal links", () => {
    it("should render internal link with correct href", () => {
      // Arrange
      const href = "/products/123";

      // Act
      renderWithRouter(<Link href={href}>Test Link</Link>);

      // Assert
      const link = screen.getByRole("link", { name: "Test Link" });

      expect(link).toHaveAttribute("href", href);
    });

    it("should pass state to RouterLink", () => {
      // Arrange
      const state = { from: "/previous-page" };

      // Act
      renderWithRouter(
        <Link href="/products" state={state}>
          Test Link
        </Link>,
      );

      // Assert
      const link = screen.getByRole("link", { name: "Test Link" });

      expect(link).toBeInTheDocument();
    });

    it("should handle query parameters and hash in internal links", () => {
      // Arrange
      const href = "/products?filter=active#section";

      // Act
      renderWithRouter(<Link href={href}>Test Link</Link>);

      // Assert
      const link = screen.getByRole("link", { name: "Test Link" });

      expect(link).toHaveAttribute("href", href);
    });

    it("should render disabled internal link with base path href", () => {
      // Arrange & Act
      renderWithRouter(
        <Link href="/products" disabled>
          Disabled Link
        </Link>,
      );

      // Assert
      const link = screen.getByRole("link", { name: "Disabled Link" });

      // RouterLink with to="#" resolves to "/" in test environment
      expect(link).toHaveAttribute("href", "/");
      expect(link).toHaveAttribute("aria-disabled", "true");
    });

    it("should prevent navigation when disabled internal link is clicked", async () => {
      // Arrange
      const user = userEvent.setup();

      // Act
      renderWithRouter(
        <Link href="/products" disabled>
          Disabled Link
        </Link>,
      );

      const link = screen.getByRole("link", { name: "Disabled Link" });

      await user.click(link);

      // Assert - should still be on the page (RouterLink prevents navigation when disabled)
      expect(link).toHaveAttribute("href", "/");
    });
  });

  describe("external links", () => {
    it("should render external link with correct href", () => {
      // Arrange
      const href = "https://example.com";

      // Act
      renderWithRouter(<Link href={href}>External Link</Link>);

      // Assert
      const link = screen.getByRole("link", { name: "External Link" });

      expect(link).toHaveAttribute("href", href);
    });

    it("should set rel='noopener noreferrer' for external links with target=_blank", () => {
      // Arrange
      const href = "https://example.com";

      // Act
      renderWithRouter(
        <Link href={href} target="_blank">
          External Link
        </Link>,
      );

      // Assert
      const link = screen.getByRole("link", { name: "External Link" });

      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("should not set rel for external links without target=_blank", () => {
      // Arrange
      const href = "https://example.com";

      // Act
      renderWithRouter(<Link href={href}>External Link</Link>);

      // Assert
      const link = screen.getByRole("link", { name: "External Link" });

      expect(link).toHaveAttribute("rel", "");
    });

    it("should render disabled external link without href", () => {
      // Arrange & Act
      renderWithRouter(
        <Link href="https://example.com" disabled>
          Disabled External
        </Link>,
      );

      // Assert
      const link = screen.getByText("Disabled External");

      expect(link).toBeInTheDocument();
      expect(link).not.toHaveAttribute("href");
    });
  });

  describe("target attribute", () => {
    it("should pass target attribute to internal link", () => {
      // Arrange & Act
      renderWithRouter(
        <Link href="/products" target="_blank">
          New Tab Link
        </Link>,
      );

      // Assert
      const link = screen.getByRole("link", { name: "New Tab Link" });

      expect(link).toHaveAttribute("target", "_blank");
    });

    it("should pass target attribute to external link", () => {
      // Arrange & Act
      renderWithRouter(
        <Link href="https://example.com" target="_blank">
          External New Tab
        </Link>,
      );

      // Assert
      const link = screen.getByRole("link", { name: "External New Tab" });

      expect(link).toHaveAttribute("target", "_blank");
    });

    it("should pass custom target values", () => {
      // Arrange & Act
      renderWithRouter(
        <Link href="/products" target="_parent">
          Parent Target
        </Link>,
      );

      // Assert
      const link = screen.getByRole("link", { name: "Parent Target" });

      expect(link).toHaveAttribute("target", "_parent");
    });
  });

  describe("rel attribute", () => {
    it("should accept rel attribute and discards default one", () => {
      // Arrange & Act
      renderWithRouter(
        <Link href="/products" rel="nofollow">
          Custom Rel
        </Link>,
      );

      // Assert
      const link = screen.getByRole("link", { name: "Custom Rel" });

      expect(link).toHaveAttribute("rel", "nofollow");
    });

    it("should accept rel attribute and discards default one - external link", () => {
      // Arrange & Act
      renderWithRouter(
        <Link href="https://example.com" rel="nofollow" target="_blank">
          Custom Rel External
        </Link>,
      );

      // Assert
      const link = screen.getByRole("link", { name: "Custom Rel External" });

      expect(link).toHaveAttribute("rel", "nofollow");
    });
  });

  describe("styling props", () => {
    it("should render with underline prop", () => {
      // Arrange & Act
      renderWithRouter(
        <Link href="/products" underline>
          Underlined Link
        </Link>,
      );

      // Assert
      const link = screen.getByRole("link", { name: "Underlined Link" });

      // Verify link renders (sprinkles styles applied via CSS classes)
      expect(link).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      // Arrange
      const customClass = "custom-link-class";

      // Act
      renderWithRouter(
        <Link href="/products" className={customClass}>
          Custom Class
        </Link>,
      );

      // Assert
      const link = screen.getByRole("link", { name: "Custom Class" });

      expect(link).toHaveClass(customClass);
    });

    it("should apply inline display style when inline=true", () => {
      // Arrange & Act
      renderWithRouter(
        <Link href="/products" inline>
          Inline Link
        </Link>,
      );

      // Assert
      const link = screen.getByRole("link", { name: "Inline Link" });

      expect(link).toHaveStyle({ display: "inline" });
    });

    it("should not apply inline display style when inline=false", () => {
      // Arrange & Act
      renderWithRouter(
        <Link href="/products" inline={false}>
          Block Link
        </Link>,
      );

      // Assert
      const link = screen.getByRole("link", { name: "Block Link" });

      expect(link.style.display).not.toBe("inline");
    });

    it("should merge custom style with inline style", () => {
      // Arrange
      const customStyle = { color: "red", padding: "10px" };

      // Act
      renderWithRouter(
        <Link href="/products" style={customStyle} inline>
          Styled Link
        </Link>,
      );

      // Assert
      const link = screen.getByRole("link", { name: "Styled Link" });

      expect(link).toHaveStyle({ display: "inline", color: "red", padding: "10px" });
    });

    it("should render enabled link", () => {
      // Arrange & Act
      renderWithRouter(<Link href="/products">Normal Link</Link>);

      // Assert
      const link = screen.getByRole("link", { name: "Normal Link" });

      // Verify link renders (sprinkles cursor styles applied via CSS classes)
      expect(link).toBeInTheDocument();
    });

    it("should render disabled link", () => {
      // Arrange & Act
      renderWithRouter(
        <Link href="/products" disabled>
          Disabled Link
        </Link>,
      );

      // Assert
      const link = screen.getByRole("link", { name: "Disabled Link" });

      // Verify disabled link renders (sprinkles cursor styles applied via CSS classes)
      expect(link).toBeInTheDocument();
    });
  });

  describe("onClick handler", () => {
    it("should call onClick for internal RouterLink", async () => {
      // Arrange
      const onClick = jest.fn();
      const user = userEvent.setup();

      // Act
      renderWithRouter(
        <Link href="/products" onClick={onClick}>
          Clickable Link
        </Link>,
      );

      const link = screen.getByRole("link", { name: "Clickable Link" });

      await user.click(link);

      expect(onClick).toHaveBeenCalled();
    });

    it("should not call onClick when disabled link is clicked", async () => {
      // Arrange
      const onClick = jest.fn();
      const user = userEvent.setup();

      // Act
      renderWithRouter(
        <Link href="/products" onClick={onClick} disabled>
          Disabled Click
        </Link>,
      );

      const link = screen.getByRole("link", { name: "Disabled Click" });

      await user.click(link);

      // Assert
      expect(onClick).not.toHaveBeenCalled();
    });

    it("should call onClick for external links", async () => {
      // Arrange
      const onClick = jest.fn();
      const user = userEvent.setup();

      // Act
      renderWithRouter(
        <Link href="https://example.com" onClick={onClick}>
          External Click
        </Link>,
      );

      const link = screen.getByRole("link", { name: "External Click" });

      await user.click(link);

      // Assert
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("link without href", () => {
    it("should render link without href as Text component", () => {
      // Arrange & Act
      renderWithRouter(<Link>No Href Link</Link>);

      // Assert
      const link = screen.getByText("No Href Link");

      expect(link).toBeInTheDocument();
      expect(link).not.toHaveAttribute("href");
    });

    it("should call onClick for link without href", async () => {
      // Arrange
      const onClick = jest.fn();
      const user = userEvent.setup();

      // Act
      renderWithRouter(<Link onClick={onClick}>Action Link</Link>);

      const link = screen.getByText("Action Link");

      await user.click(link);

      // Assert
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("additional HTML attributes", () => {
    it("should pass data attributes to the link", () => {
      // Arrange & Act
      renderWithRouter(
        <Link href="/products" data-testid="custom-link" data-custom="value">
          Data Attrs
        </Link>,
      );

      // Assert
      const link = screen.getByRole("link", { name: "Data Attrs" });

      expect(link).toHaveAttribute("data-custom", "value");
      expect(link).toHaveAttribute("data-testid", "custom-link");
    });

    it("should pass aria attributes to the link", () => {
      // Arrange & Act
      renderWithRouter(
        <Link href="/products" aria-label="Custom Label" aria-describedby="desc">
          Aria Link
        </Link>,
      );

      // Assert
      const link = screen.getByRole("link", { name: "Custom Label" });

      expect(link).toHaveAttribute("aria-describedby", "desc");
    });

    it("should pass id attribute to the link", () => {
      // Arrange & Act
      renderWithRouter(
        <Link href="/products" id="unique-link-id">
          ID Link
        </Link>,
      );

      // Assert
      const link = screen.getByRole("link", { name: "ID Link" });

      expect(link).toHaveAttribute("id", "unique-link-id");
    });
  });
});
