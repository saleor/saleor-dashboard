import { channel } from "@dashboard/channels/fixtures";
import { type ChannelQuery } from "@dashboard/graphql";
import { fireEvent, render, screen, within } from "@testing-library/react";

import { ChannelMetadataDialog } from "./ChannelMetadataDialog";

const mockOnSubmit = jest.fn();

jest.mock("@dashboard/components/MetadataDialog/useHandleMetadataSubmit", () => ({
  useHandleMetadataSubmit: jest.fn(() => ({
    onSubmit: mockOnSubmit,
    lastSubmittedData: undefined,
    submitInProgress: false,
  })),
}));

type ChannelMetadataDialogData = NonNullable<ChannelQuery["channel"]>;

const mockChannel: ChannelMetadataDialogData = {
  ...channel,
  metadata: [{ key: "test-key", value: "test-value", __typename: "MetadataItem" }],
  privateMetadata: [{ key: "private-key", value: "private-value", __typename: "MetadataItem" }],
};

describe("ChannelMetadataDialog", () => {
  const onCloseMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders dialog with correct title when open", () => {
    // Arrange & Act
    render(<ChannelMetadataDialog open={true} onClose={onCloseMock} channel={mockChannel} />);

    // Assert
    expect(screen.getByText("Channel Metadata")).toBeInTheDocument();
  });

  it("does not render when open is false", () => {
    // Arrange & Act
    render(<ChannelMetadataDialog open={false} onClose={onCloseMock} channel={mockChannel} />);

    // Assert
    expect(screen.queryByText("Channel Metadata")).not.toBeInTheDocument();
  });

  it("closes when user clicks close button", () => {
    // Arrange
    render(<ChannelMetadataDialog open={true} onClose={onCloseMock} channel={mockChannel} />);

    // Act
    fireEvent.click(screen.getByTestId("back"));

    // Assert
    expect(onCloseMock).toHaveBeenCalled();
  });

  it("renders with undefined channel", () => {
    // Arrange & Act
    render(<ChannelMetadataDialog open={true} onClose={onCloseMock} channel={undefined} />);

    // Assert
    expect(screen.getByText("Channel Metadata")).toBeInTheDocument();
  });

  it("displays metadata when section is expanded", () => {
    // Arrange
    render(<ChannelMetadataDialog open={true} onClose={onCloseMock} channel={mockChannel} />);

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
    render(<ChannelMetadataDialog open={true} onClose={onCloseMock} channel={mockChannel} />);

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
