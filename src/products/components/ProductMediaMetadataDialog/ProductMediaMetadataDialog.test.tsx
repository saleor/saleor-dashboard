import { type ProductMediaByIdQuery, ProductMediaType } from "@dashboard/graphql";
import { fireEvent, render, screen, within } from "@testing-library/react";

import { ProductMediaMetadataDialog } from "./ProductMediaMetadataDialog";

const mockOnSubmit = jest.fn();

jest.mock("@dashboard/components/MetadataDialog/useHandleMetadataSubmit", () => ({
  useHandleMetadataSubmit: jest.fn(() => ({
    onSubmit: mockOnSubmit,
    lastSubmittedData: undefined,
    submitInProgress: false,
  })),
}));

const mockMedia: NonNullable<NonNullable<ProductMediaByIdQuery["product"]>["mainImage"]> = {
  __typename: "ProductMedia",
  id: "media-id",
  alt: "Alt text",
  url: "https://example.com/image.jpg",
  type: ProductMediaType.IMAGE,
  oembedData: "{}",
  metadata: [{ __typename: "MetadataItem", key: "media-key", value: "media-value" }],
  privateMetadata: [{ __typename: "MetadataItem", key: "private-key", value: "private-value" }],
};

describe("ProductMediaMetadataDialog", () => {
  const onCloseMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders dialog with correct title when open", () => {
    // Arrange & Act
    render(<ProductMediaMetadataDialog open={true} onClose={onCloseMock} media={mockMedia} />);

    // Assert
    expect(screen.getByText("Media Metadata")).toBeInTheDocument();
  });

  it("does not render when open is false", () => {
    // Arrange & Act
    render(<ProductMediaMetadataDialog open={false} onClose={onCloseMock} media={mockMedia} />);

    // Assert
    expect(screen.queryByText("Media Metadata")).not.toBeInTheDocument();
  });

  it("closes when user clicks close button", () => {
    // Arrange
    render(<ProductMediaMetadataDialog open={true} onClose={onCloseMock} media={mockMedia} />);

    // Act
    fireEvent.click(screen.getByTestId("back"));

    // Assert
    expect(onCloseMock).toHaveBeenCalled();
  });

  it("displays metadata when section is expanded", () => {
    // Arrange
    render(<ProductMediaMetadataDialog open={true} onClose={onCloseMock} media={mockMedia} />);

    const metadataEditors = screen.getAllByTestId("metadata-editor");
    const publicMetadataEditor = metadataEditors.find(
      editor => editor.getAttribute("data-test-is-private") === "false",
    )!;

    // Act
    fireEvent.click(within(publicMetadataEditor).getByTestId("expand"));

    // Assert
    expect(within(publicMetadataEditor).getByDisplayValue("media-key")).toBeInTheDocument();
    expect(within(publicMetadataEditor).getByDisplayValue("media-value")).toBeInTheDocument();
  });

  it("normalizes missing privateMetadata to empty list", () => {
    // Arrange
    const { privateMetadata: _omitted, ...mediaWithoutPrivateMetadata } = mockMedia;

    // Act
    render(
      <ProductMediaMetadataDialog
        open={true}
        onClose={onCloseMock}
        media={
          mediaWithoutPrivateMetadata as unknown as NonNullable<
            NonNullable<ProductMediaByIdQuery["product"]>["mainImage"]
          >
        }
      />,
    );

    // Assert
    expect(screen.getAllByTestId("metadata-editor")).toHaveLength(2);
  });
});
