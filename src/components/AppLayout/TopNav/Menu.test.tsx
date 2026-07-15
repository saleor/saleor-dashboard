import { ThemeProvider } from "@saleor/macaw-ui-next";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Trash2 } from "lucide-react";
import type { ReactNode } from "react";

import { Menu, type TopNavMenuItem } from "./Menu";

const Wrapper = ({ children }: { children: ReactNode }): JSX.Element => (
  <ThemeProvider>{children}</ThemeProvider>
);

const menuItems: TopNavMenuItem[] = [
  {
    label: "Open in GraphiQL",
    onSelect: jest.fn(),
    testId: "graphiql-redirect",
    icon: <span data-test-id="graphiql-icon" />,
  },
  {
    label: "Delete",
    onSelect: jest.fn(),
    testId: "delete-item",
    color: "critical1",
    icon: <Trash2 data-test-id="delete-icon" />,
  },
];

describe("TopNav Menu", () => {
  it("renders menu item icons", async () => {
    // Arrange
    const user = userEvent.setup();

    render(<Menu items={menuItems} />, { wrapper: Wrapper });

    // Act
    await user.click(screen.getByTestId("show-more-button"));

    // Assert
    expect(screen.getByTestId("graphiql-icon")).toBeInTheDocument();
    expect(screen.getByTestId("delete-icon")).toBeInTheDocument();
  });

  it("calls onSelect when a menu item is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const onDelete = jest.fn();
    const items: TopNavMenuItem[] = [
      {
        label: "Delete",
        onSelect: onDelete,
        testId: "delete-item",
        color: "critical1",
      },
    ];

    render(<Menu items={items} />, { wrapper: Wrapper });
    await user.click(screen.getByTestId("show-more-button"));

    // Act
    await user.click(screen.getByTestId("delete-item"));

    // Assert
    expect(onDelete).toHaveBeenCalled();
  });

  it("renders a custom trigger when provided", () => {
    // Arrange // Act
    render(
      <Menu items={menuItems} trigger={<button type="button" data-test-id="custom-trigger" />} />,
      { wrapper: Wrapper },
    );

    // Assert
    expect(screen.getByTestId("custom-trigger")).toBeInTheDocument();
    expect(screen.queryByTestId("show-more-button")).not.toBeInTheDocument();
  });
});
