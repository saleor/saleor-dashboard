import { collection } from "@dashboard/collections/fixtures";
import { type CollectionDetailsFragment } from "@dashboard/graphql";
import { fireEvent, render, screen, within } from "@testing-library/react";

import { CollectionMetadataDialog } from "./CollectionMetadataDialog";

const mockOnSubmit = jest.fn();

jest.mock("@dashboard/components/MetadataDialog/useHandleMetadataSubmit", () => ({
  useHandleMetadataSubmit: jest.fn(() => ({
    onSubmit: mockOnSubmit,
    lastSubmittedData: undefined,
    submitInProgress: false,
  })),
}));

const placeholderImage = "image.jpg";
const baseCollection = collection(placeholderImage, placeholderImage);

if (!baseCollection) {
  throw new Error("Expected collection fixture");
}

const mockCollection: CollectionDetailsFragment = {
  ...baseCollection,
  metadata: [{ key: "test-key", value: "test-value", __typename: "MetadataItem" }],
  privateMetadata: [{ key: "private-key", value: "private-value", __typename: "MetadataItem" }],
};

describe("CollectionMetadataDialog", () => {
  const onCloseMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders dialog with correct title when open", () => {
    // Arrange & Act
    render(
      <CollectionMetadataDialog open={true} onClose={onCloseMock} collection={mockCollection} />,
    );

    // Assert
    expect(screen.getByText("Collection Metadata")).toBeInTheDocument();
  });

  it("does not render when open is false", () => {
    // Arrange & Act
    render(
      <CollectionMetadataDialog open={false} onClose={onCloseMock} collection={mockCollection} />,
    );

    // Assert
    expect(screen.queryByText("Collection Metadata")).not.toBeInTheDocument();
  });

  it("closes when user clicks close button", () => {
    // Arrange
    render(
      <CollectionMetadataDialog open={true} onClose={onCloseMock} collection={mockCollection} />,
    );

    // Act
    fireEvent.click(screen.getByTestId("back"));

    // Assert
    expect(onCloseMock).toHaveBeenCalled();
  });

  it("renders with undefined collection", () => {
    // Arrange & Act
    render(<CollectionMetadataDialog open={true} onClose={onCloseMock} collection={undefined} />);

    // Assert
    expect(screen.getByText("Collection Metadata")).toBeInTheDocument();
  });

  it("displays metadata when section is expanded", () => {
    // Arrange
    render(
      <CollectionMetadataDialog open={true} onClose={onCloseMock} collection={mockCollection} />,
    );

    const metadataEditors = screen.getAllByTestId("metadata-editor");
    const publicMetadataEditor = metadataEditors.find(
      editor => editor.getAttribute("data-test-is-private") === "false",
    )!;

    // Act
    const expandButton = within(publicMetadataEditor).getByTestId("expand");

    fireEvent.click(expandButton);

    // Assert
    expect(within(publicMetadataEditor).getByDisplayValue("test-key")).toBeInTheDocument();
    expect(within(publicMetadataEditor).getByDisplayValue("test-value")).toBeInTheDocument();
  });

  it("displays private metadata when section is expanded", () => {
    // Arrange
    render(
      <CollectionMetadataDialog open={true} onClose={onCloseMock} collection={mockCollection} />,
    );

    const metadataEditors = screen.getAllByTestId("metadata-editor");
    const privateMetadataEditor = metadataEditors.find(
      editor => editor.getAttribute("data-test-is-private") === "true",
    )!;

    // Act
    const expandButton = within(privateMetadataEditor).getByTestId("expand");

    fireEvent.click(expandButton);

    // Assert
    expect(within(privateMetadataEditor).getByDisplayValue("private-key")).toBeInTheDocument();
    expect(within(privateMetadataEditor).getByDisplayValue("private-value")).toBeInTheDocument();
  });
});
