import { attribute } from "@dashboard/attributes/fixtures";
import { type AttributeDetailsQuery } from "@dashboard/graphql";
import { fireEvent, render, screen, within } from "@testing-library/react";

import { AttributeMetadataDialog } from "./AttributeMetadataDialog";

const mockOnSubmit = jest.fn();

jest.mock("@dashboard/components/MetadataDialog/useHandleMetadataSubmit", () => ({
  useHandleMetadataSubmit: jest.fn(() => ({
    onSubmit: mockOnSubmit,
    lastSubmittedData: undefined,
    submitInProgress: false,
  })),
}));

const mockAttribute: NonNullable<AttributeDetailsQuery["attribute"]> = {
  ...attribute!,
  metadata: [{ key: "test-key", value: "test-value", __typename: "MetadataItem" }],
  privateMetadata: [{ key: "private-key", value: "private-value", __typename: "MetadataItem" }],
};

describe("AttributeMetadataDialog", () => {
  const onCloseMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders dialog with correct title when open", () => {
    // Arrange & Act
    render(<AttributeMetadataDialog open={true} onClose={onCloseMock} attribute={mockAttribute} />);

    // Assert
    expect(screen.getByText("Attribute Metadata")).toBeInTheDocument();
  });

  it("does not render when open is false", () => {
    // Arrange & Act
    render(
      <AttributeMetadataDialog open={false} onClose={onCloseMock} attribute={mockAttribute} />,
    );

    // Assert
    expect(screen.queryByText("Attribute Metadata")).not.toBeInTheDocument();
  });

  it("closes when user clicks close button", () => {
    // Arrange
    render(<AttributeMetadataDialog open={true} onClose={onCloseMock} attribute={mockAttribute} />);

    // Act
    fireEvent.click(screen.getByTestId("back"));

    // Assert
    expect(onCloseMock).toHaveBeenCalled();
  });

  it("displays metadata when section is expanded", () => {
    // Arrange
    render(<AttributeMetadataDialog open={true} onClose={onCloseMock} attribute={mockAttribute} />);

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
});
