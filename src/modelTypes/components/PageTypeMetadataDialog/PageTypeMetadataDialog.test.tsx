import { type PageTypeDetailsFragment } from "@dashboard/graphql";
import { pageType } from "@dashboard/modelTypes/fixtures";
import { fireEvent, render, screen, within } from "@testing-library/react";

import { PageTypeMetadataDialog } from "./PageTypeMetadataDialog";

const mockOnSubmit = jest.fn();

jest.mock("@dashboard/components/MetadataDialog/useHandleMetadataSubmit", () => ({
  useHandleMetadataSubmit: jest.fn(() => ({
    onSubmit: mockOnSubmit,
    lastSubmittedData: undefined,
    submitInProgress: false,
  })),
}));

const mockPageType: PageTypeDetailsFragment = {
  ...pageType,
  metadata: [{ key: "test-key", value: "test-value", __typename: "MetadataItem" }],
  privateMetadata: [{ key: "private-key", value: "private-value", __typename: "MetadataItem" }],
};

describe("PageTypeMetadataDialog", () => {
  const onCloseMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders dialog with correct title when open", () => {
    // Arrange & Act
    render(<PageTypeMetadataDialog open={true} onClose={onCloseMock} pageType={mockPageType} />);

    // Assert
    expect(screen.getByText("Model Type Metadata")).toBeInTheDocument();
  });

  it("does not render when open is false", () => {
    // Arrange & Act
    render(<PageTypeMetadataDialog open={false} onClose={onCloseMock} pageType={mockPageType} />);

    // Assert
    expect(screen.queryByText("Model Type Metadata")).not.toBeInTheDocument();
  });

  it("closes when user clicks close button", () => {
    // Arrange
    render(<PageTypeMetadataDialog open={true} onClose={onCloseMock} pageType={mockPageType} />);

    // Act
    fireEvent.click(screen.getByTestId("back"));

    // Assert
    expect(onCloseMock).toHaveBeenCalled();
  });

  it("renders with undefined page type", () => {
    // Arrange & Act
    render(<PageTypeMetadataDialog open={true} onClose={onCloseMock} pageType={undefined} />);

    // Assert
    expect(screen.getByText("Model Type Metadata")).toBeInTheDocument();
  });

  it("displays metadata when section is expanded", () => {
    // Arrange
    render(<PageTypeMetadataDialog open={true} onClose={onCloseMock} pageType={mockPageType} />);

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
    render(<PageTypeMetadataDialog open={true} onClose={onCloseMock} pageType={mockPageType} />);

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
