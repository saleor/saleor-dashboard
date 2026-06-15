import { type PageDetailsFragment } from "@dashboard/graphql";
import { page } from "@dashboard/modeling/fixtures";
import { fireEvent, render, screen, within } from "@testing-library/react";

import { PageMetadataDialog } from "./PageMetadataDialog";

const mockOnSubmit = jest.fn();

jest.mock("@dashboard/components/MetadataDialog/useHandleMetadataSubmit", () => ({
  useHandleMetadataSubmit: jest.fn(() => ({
    onSubmit: mockOnSubmit,
    lastSubmittedData: undefined,
    submitInProgress: false,
  })),
}));

const mockPage: PageDetailsFragment = {
  ...page,
  metadata: [{ key: "test-key", value: "test-value", __typename: "MetadataItem" }],
  privateMetadata: [{ key: "private-key", value: "private-value", __typename: "MetadataItem" }],
};

describe("PageMetadataDialog", () => {
  const onCloseMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders dialog with correct title when open", () => {
    // Arrange & Act
    render(<PageMetadataDialog open={true} onClose={onCloseMock} page={mockPage} />);

    // Assert
    expect(screen.getByText("Model Metadata")).toBeInTheDocument();
  });

  it("does not render when open is false", () => {
    // Arrange & Act
    render(<PageMetadataDialog open={false} onClose={onCloseMock} page={mockPage} />);

    // Assert
    expect(screen.queryByText("Model Metadata")).not.toBeInTheDocument();
  });

  it("closes when user clicks close button", () => {
    // Arrange
    render(<PageMetadataDialog open={true} onClose={onCloseMock} page={mockPage} />);

    // Act
    fireEvent.click(screen.getByTestId("back"));

    // Assert
    expect(onCloseMock).toHaveBeenCalled();
  });

  it("displays metadata when section is expanded", () => {
    // Arrange
    render(<PageMetadataDialog open={true} onClose={onCloseMock} page={mockPage} />);

    const metadataEditors = screen.getAllByTestId("metadata-editor");
    const publicMetadataEditor = metadataEditors.find(
      editor => editor.getAttribute("data-test-is-private") === "false",
    )!;

    // Act
    fireEvent.click(within(publicMetadataEditor).getByTestId("expand"));

    // Assert
    expect(within(publicMetadataEditor).getByDisplayValue("test-key")).toBeInTheDocument();
    expect(within(publicMetadataEditor).getByDisplayValue("test-value")).toBeInTheDocument();
  });
});
