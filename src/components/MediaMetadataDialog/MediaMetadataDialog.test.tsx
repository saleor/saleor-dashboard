import { ProductMediaByIdDocument } from "@dashboard/graphql";
import { fireEvent, render, screen, within } from "@testing-library/react";

import { MediaMetadataDialog } from "./MediaMetadataDialog";

const mockOnSubmit = jest.fn();

jest.mock("@dashboard/components/MetadataDialog/useHandleMetadataSubmit", () => ({
  useHandleMetadataSubmit: jest.fn(() => ({
    onSubmit: mockOnSubmit,
    lastSubmittedData: undefined,
    submitInProgress: false,
  })),
}));

const mockMedia = {
  id: "media-id",
  metadata: [{ __typename: "MetadataItem" as const, key: "media-key", value: "media-value" }],
  privateMetadata: [
    { __typename: "MetadataItem" as const, key: "private-key", value: "private-value" },
  ],
};

describe("MediaMetadataDialog", () => {
  const onCloseMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders dialog with correct title when open", () => {
    // Arrange & Act
    render(
      <MediaMetadataDialog
        open={true}
        onClose={onCloseMock}
        media={mockMedia}
        refetchDocument={ProductMediaByIdDocument}
      />,
    );

    // Assert
    expect(screen.getByText("Media Metadata")).toBeInTheDocument();
  });

  it("does not render when open is false", () => {
    // Arrange & Act
    render(
      <MediaMetadataDialog
        open={false}
        onClose={onCloseMock}
        media={mockMedia}
        refetchDocument={ProductMediaByIdDocument}
      />,
    );

    // Assert
    expect(screen.queryByText("Media Metadata")).not.toBeInTheDocument();
  });

  it("closes when user clicks close button", () => {
    // Arrange
    render(
      <MediaMetadataDialog
        open={true}
        onClose={onCloseMock}
        media={mockMedia}
        refetchDocument={ProductMediaByIdDocument}
      />,
    );

    // Act
    fireEvent.click(screen.getByTestId("back"));

    // Assert
    expect(onCloseMock).toHaveBeenCalled();
  });

  it("displays metadata when section is expanded", () => {
    // Arrange
    render(
      <MediaMetadataDialog
        open={true}
        onClose={onCloseMock}
        media={mockMedia}
        refetchDocument={ProductMediaByIdDocument}
      />,
    );

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
      <MediaMetadataDialog
        open={true}
        onClose={onCloseMock}
        media={mediaWithoutPrivateMetadata}
        refetchDocument={ProductMediaByIdDocument}
      />,
    );

    // Assert
    expect(screen.getAllByTestId("metadata-editor")).toHaveLength(2);
  });
});
