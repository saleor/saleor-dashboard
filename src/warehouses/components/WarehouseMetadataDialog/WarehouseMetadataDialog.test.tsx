import { WarehouseDetailsFragment } from "@dashboard/graphql";
import { warehouse } from "@dashboard/warehouses/fixtures";
import { fireEvent, render, screen, within } from "@testing-library/react";

import { WarehouseMetadataDialog } from "./WarehouseMetadataDialog";

const mockOnSubmit = jest.fn();

jest.mock("@dashboard/components/MetadataDialog/useHandleMetadataSubmit", () => ({
  useHandleMetadataSubmit: jest.fn(() => ({
    onSubmit: mockOnSubmit,
    lastSubmittedData: undefined,
    submitInProgress: false,
  })),
}));

const mockWarehouse: WarehouseDetailsFragment = {
  ...warehouse,
  metadata: [{ key: "test-key", value: "test-value", __typename: "MetadataItem" }],
  privateMetadata: [{ key: "private-key", value: "private-value", __typename: "MetadataItem" }],
};

describe("WarehouseMetadataDialog", () => {
  const onCloseMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders dialog with correct title when open", () => {
    // Arrange & Act
    render(<WarehouseMetadataDialog open={true} onClose={onCloseMock} warehouse={mockWarehouse} />);

    // Assert
    expect(screen.getByText("Warehouse Metadata")).toBeInTheDocument();
  });

  it("does not render when open is false", () => {
    // Arrange & Act
    render(
      <WarehouseMetadataDialog open={false} onClose={onCloseMock} warehouse={mockWarehouse} />,
    );

    // Assert
    expect(screen.queryByText("Warehouse Metadata")).not.toBeInTheDocument();
  });

  it("closes when user clicks close button", () => {
    // Arrange
    render(<WarehouseMetadataDialog open={true} onClose={onCloseMock} warehouse={mockWarehouse} />);

    // Act
    fireEvent.click(screen.getByTestId("back"));

    // Assert
    expect(onCloseMock).toHaveBeenCalled();
  });

  it("renders with undefined warehouse", () => {
    // Arrange & Act
    render(<WarehouseMetadataDialog open={true} onClose={onCloseMock} warehouse={undefined} />);

    // Assert
    expect(screen.getByText("Warehouse Metadata")).toBeInTheDocument();
  });

  it("displays metadata when section is expanded", () => {
    // Arrange
    render(<WarehouseMetadataDialog open={true} onClose={onCloseMock} warehouse={mockWarehouse} />);

    const metadataEditors = screen.getAllByTestId("metadata-editor");
    const publicMetadataEditor = metadataEditors.find(
      editor => editor.getAttribute("data-test-is-private") === "false",
    )!;

    // Act - expand metadata section
    const expandButton = within(publicMetadataEditor).getByTestId("expand");

    fireEvent.click(expandButton);

    // Assert - check metadata values after expansion
    expect(within(publicMetadataEditor).getByDisplayValue("test-key")).toBeInTheDocument();
    expect(within(publicMetadataEditor).getByDisplayValue("test-value")).toBeInTheDocument();
  });

  it("displays private metadata when section is expanded", () => {
    // Arrange
    render(<WarehouseMetadataDialog open={true} onClose={onCloseMock} warehouse={mockWarehouse} />);

    const metadataEditors = screen.getAllByTestId("metadata-editor");
    const privateMetadataEditor = metadataEditors.find(
      editor => editor.getAttribute("data-test-is-private") === "true",
    )!;

    // Act - expand private metadata section
    const expandButton = within(privateMetadataEditor).getByTestId("expand");

    fireEvent.click(expandButton);

    // Assert - check private metadata values after expansion
    expect(within(privateMetadataEditor).getByDisplayValue("private-key")).toBeInTheDocument();
    expect(within(privateMetadataEditor).getByDisplayValue("private-value")).toBeInTheDocument();
  });
});
