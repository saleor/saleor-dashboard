import { fireEvent, render, screen } from "@testing-library/react";
import { ReactNode } from "react";
import { IntlProvider } from "react-intl";
import { MemoryRouter } from "react-router";

import { CustomerSection, CustomerSectionProps } from "./CustomerSection";

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

jest.mock("@dashboard/components/Link", () => ({
  __esModule: true,
  default: ({
    children,
    href,
    onClick,
  }: {
    children: ReactNode;
    href: string;
    onClick?: () => void;
  }) => (
    <a href={href} onClick={onClick}>
      {children}
    </a>
  ),
}));

jest.mock("@dashboard/components/RequirePermissions", () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

const defaultProps: CustomerSectionProps = {
  user: null,
  userEmail: null,
  onProfileView: jest.fn(),
  userEmailClassName: "test-class",
};

const Wrapper = ({ children }: { children: ReactNode }) => (
  <IntlProvider locale="en">
    <MemoryRouter>{children}</MemoryRouter>
  </IntlProvider>
);

describe("CustomerSection", () => {
  it("renders loading skeleton when user is undefined", () => {
    // Arrange
    const props: CustomerSectionProps = {
      ...defaultProps,
      user: undefined,
      userEmail: undefined,
    };

    // Act
    render(
      <Wrapper>
        <CustomerSection {...props} />
      </Wrapper>,
    );

    // Assert
    // Check for Skeleton component by its class or data attribute
    const skeleton = document.querySelector('[data-macaw-ui-component="Skeleton"]');

    expect(skeleton).toBeInTheDocument();
  });

  it("renders anonymous customer when no user and no email", () => {
    // Arrange
    const props: CustomerSectionProps = {
      ...defaultProps,
      user: null,
      userEmail: null,
    };

    // Act
    render(
      <Wrapper>
        <CustomerSection {...props} />
      </Wrapper>,
    );

    // Assert
    expect(screen.getByText("Anonymous user")).toBeInTheDocument();
  });

  it("renders customer email with View Orders link when only email exists", () => {
    // Arrange
    const props: CustomerSectionProps = {
      ...defaultProps,
      user: null,
      userEmail: "test@example.com",
    };

    // Act
    render(
      <Wrapper>
        <CustomerSection {...props} />
      </Wrapper>,
    );

    // Assert
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
    expect(screen.getByText("View Orders")).toBeInTheDocument();

    const viewOrdersLink = screen.getByRole("link", { name: "View Orders" });

    expect(viewOrdersLink).toHaveAttribute("href", expect.stringContaining("userEmail"));
    expect(viewOrdersLink).toHaveAttribute("href", expect.stringContaining("test%40example.com"));
  });

  it("renders registered customer with View Profile and View Orders links", () => {
    // Arrange
    const props: CustomerSectionProps = {
      ...defaultProps,
      user: {
        __typename: "User" as const,
        id: "user-123",
        email: "user@example.com",
      },
      userEmail: "user@example.com",
    };

    // Act
    render(
      <Wrapper>
        <CustomerSection {...props} />
      </Wrapper>,
    );

    // Assert
    expect(screen.getByTestId("customer-email")).toHaveTextContent("user@example.com");
    expect(screen.getByText("View Profile")).toBeInTheDocument();
    expect(screen.getByText("View Orders")).toBeInTheDocument();

    const viewOrdersLink = screen.getByRole("link", { name: "View Orders" });

    expect(viewOrdersLink).toHaveAttribute("href", expect.stringContaining("customer"));
    expect(viewOrdersLink).toHaveAttribute("href", expect.stringContaining("user-123"));
  });

  it("calls onProfileView when View Profile link is clicked", () => {
    // Arrange
    const onProfileViewMock = jest.fn();
    const props: CustomerSectionProps = {
      ...defaultProps,
      onProfileView: onProfileViewMock,
      user: {
        __typename: "User" as const,
        id: "user-123",
        email: "user@example.com",
      },
      userEmail: "user@example.com",
    };

    // Act
    render(
      <Wrapper>
        <CustomerSection {...props} />
      </Wrapper>,
    );

    const viewProfileLink = screen.getByRole("link", { name: "View Profile" });

    // Assert
    fireEvent.click(viewProfileLink);
    expect(onProfileViewMock).toHaveBeenCalled();
  });
});
