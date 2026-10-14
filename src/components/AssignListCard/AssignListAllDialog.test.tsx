import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type ComponentProps } from "react";
import { MemoryRouter } from "react-router-dom";

import { AssignListAllDialog } from "./AssignListAllDialog";

type DialogProps = ComponentProps<typeof AssignListAllDialog>;

const baseProps: DialogProps = {
  open: true,
  title: "Shipping zones",
  items: [
    { id: "z-eu", name: "Europe" },
    { id: "z-asia", name: "Asia" },
  ],
  loading: false,
  searchLabel: "Search shipping zones",
  searchPlaceholder: "Search by shipping zone name",
  noMatchMessage: "No shipping zones found",
  removable: true,
  removeLabel: item => `Remove ${item.name}`,
  onRemoveItem: jest.fn(),
  onClose: jest.fn(),
};

const renderDialog = (props: DialogProps): ReturnType<typeof render> =>
  render(
    <Wrapper>
      <MemoryRouter>
        <AssignListAllDialog {...props} />
      </MemoryRouter>
    </Wrapper>,
  );

describe("AssignListAllDialog", () => {
  it("filters the list by name", async () => {
    // Arrange
    renderDialog(baseProps);

    // Act
    await userEvent.type(screen.getByPlaceholderText("Search by shipping zone name"), "eur");

    // Assert
    expect(screen.getAllByTestId("assign-list-all-row")).toHaveLength(1);
    expect(screen.getByText("Europe")).toBeInTheDocument();
  });

  it("says nothing matched", async () => {
    // Arrange
    renderDialog(baseProps);

    // Act
    await userEvent.type(screen.getByPlaceholderText("Search by shipping zone name"), "mars");

    // Assert
    expect(screen.getByText("No shipping zones found")).toBeInTheDocument();
  });

  it("loads the next page while a search runs over a partly loaded list", async () => {
    // Arrange
    const onFetchMore = jest.fn();

    renderDialog({ ...baseProps, hasMore: true, onFetchMore });

    // Act
    await userEvent.type(screen.getByPlaceholderText("Search by shipping zone name"), "a");

    // Assert
    expect(onFetchMore).toHaveBeenCalled();
  });

  it("removes an item from the list", async () => {
    // Arrange
    const onRemoveItem = jest.fn();

    renderDialog({ ...baseProps, onRemoveItem });

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Remove Asia" }));

    // Assert
    expect(onRemoveItem).toHaveBeenCalledWith("z-asia");
  });
});
