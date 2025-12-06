import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { ThemeProvider } from "@saleor/macaw-ui";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pencil } from "lucide-react";

import { RowActions } from "./RowActions";

describe("RowActions", () => {
  it("should render empty when menu items count equal to 0", () => {
    // Arrange & Act

    const { container } = render(
      // @ts-expect-error - legacy provider
      <ThemeProvider>
        <RowActions menuItems={[]} disabled={false} />
      </ThemeProvider>,
    );

    // Assert
    expect(container.firstChild).toBeNull();
  });
  it("should render icon button when only one menu item and has icon props", () => {
    // Arrange & Act
    render(
      // @ts-expect-error - legacy provider
      <ThemeProvider>
        <RowActions
          menuItems={[
            {
              label: "Edit",
              onSelect: jest.fn(),
              Icon: (
                <Pencil
                  size={iconSize.small}
                  strokeWidth={iconStrokeWidthBySize.small}
                  data-test-id="edit-icon"
                />
              ),
            },
          ]}
          disabled={false}
        />
      </ThemeProvider>,
    );
    // Assert
    expect(screen.getByTestId("row-action-button")).toBeInTheDocument();
    expect(screen.getByTestId("edit-icon")).toBeInTheDocument();
  });
  it("should render card meu when only one menu item and has no icon props", () => {
    // Arrange & Act
    render(
      // @ts-expect-error - legacy provider
      <ThemeProvider>
        <RowActions
          menuItems={[
            {
              label: "Edit",
              onSelect: jest.fn(),
            },
          ]}
          disabled={false}
        />
      </ThemeProvider>,
    );
    // Assert
    expect(screen.getByTestId("show-more-button")).toBeInTheDocument();
  });
  it("should render card menu with multiple items", async () => {
    // Arrange
    render(
      // @ts-expect-error - legacy provider
      <ThemeProvider>
        <RowActions
          menuItems={[
            {
              label: "Edit",
              onSelect: jest.fn(),
              testId: "edit-button",
            },
            {
              label: "Delete",
              onSelect: jest.fn(),
              testId: "delete-button",
            },
            {
              label: "Upgrade",
              onSelect: jest.fn(),
              testId: "upgrade-button",
            },
          ]}
          disabled={false}
        />
      </ThemeProvider>,
    );
    // Act
    await userEvent.click(screen.getByTestId("show-more-button"));
    // Assert
    expect(screen.getByTestId("show-more-button")).toBeInTheDocument();
    expect(screen.getByTestId("edit-button")).toBeInTheDocument();
    expect(screen.getByTestId("delete-button")).toBeInTheDocument();
    expect(screen.getByTestId("upgrade-button")).toBeInTheDocument();
  });
  it("should fire callback when click on icon button when single menu item with icon props", async () => {
    // Arrange
    const onSelectCallback = jest.fn();

    render(
      // @ts-expect-error - legacy provider
      <ThemeProvider>
        <RowActions
          menuItems={[
            {
              label: "Edit",
              onSelect: onSelectCallback,
              Icon: <Pencil size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />,
            },
          ]}
          disabled={false}
        />
      </ThemeProvider>,
    );
    // Act
    await userEvent.click(screen.getByTestId("row-action-button"));
    // Assert
    expect(onSelectCallback).toHaveBeenCalled();
  });
  it("should fire callback when click on icon button when multiple menu item", async () => {
    // Arrange
    const onIconClickCallback = jest.fn();

    render(
      // @ts-expect-error - legacy provider
      <ThemeProvider>
        <RowActions
          menuItems={[
            {
              label: "Edit",
              onSelect: onIconClickCallback,
              testId: "edit-button",
            },
            {
              label: "Delete",
              onSelect: jest.fn(),
            },
            {
              label: "Upgrade",
              onSelect: jest.fn(),
            },
          ]}
          disabled={false}
        />
      </ThemeProvider>,
    );
    // Act
    await userEvent.click(screen.getByTestId("show-more-button"));
    await userEvent.click(screen.getByTestId("edit-button"));
    // Assert
    expect(onIconClickCallback).toHaveBeenCalled();
  });
  it("should disabled show more button when RowAction disabled", async () => {
    // Arrange & Act
    render(
      // @ts-expect-error - legacy provider
      <ThemeProvider>
        <RowActions
          menuItems={[
            {
              label: "Edit",
              onSelect: jest.fn(),
            },
            {
              label: "Delete",
              onSelect: jest.fn(),
            },
          ]}
          disabled={true}
        />
      </ThemeProvider>,
    );
    // Assert
    expect(screen.getByTestId("show-more-button")).toBeDisabled();
  });
  it("should disabled row action button when RowAction disabled", async () => {
    // Arrange & Act
    render(
      // @ts-expect-error - legacy provider
      <ThemeProvider>
        <RowActions
          menuItems={[
            {
              label: "Edit",
              onSelect: jest.fn(),
              Icon: <Pencil size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />,
            },
          ]}
          disabled={true}
        />
      </ThemeProvider>,
    );
    // Assert
    expect(screen.getByTestId("row-action-button")).toBeDisabled();
  });
});
