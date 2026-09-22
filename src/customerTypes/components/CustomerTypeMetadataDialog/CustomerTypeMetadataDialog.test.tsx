import { customerType } from "@dashboard/customerTypes/fixtures";
import { type CustomerTypeDetailsFragment, type MetadataItemFragment } from "@dashboard/graphql";
import { fireEvent, render, screen, within } from "@testing-library/react";

import { CustomerTypeMetadataDialog } from "./CustomerTypeMetadataDialog";

const mockOnSubmit = jest.fn();

jest.mock("@dashboard/components/MetadataDialog/useHandleMetadataSubmit", () => ({
  useHandleMetadataSubmit: jest.fn(() => ({
    onSubmit: mockOnSubmit,
    lastSubmittedData: undefined,
    submitInProgress: false,
  })),
}));

const mockCustomerType: CustomerTypeDetailsFragment & {
  privateMetadata: MetadataItemFragment[];
} = {
  ...customerType,
  metadata: [{ key: "test-key", value: "test-value", __typename: "MetadataItem" }],
  privateMetadata: [{ key: "private-key", value: "private-value", __typename: "MetadataItem" }],
};

describe("CustomerTypeMetadataDialog", () => {
  const onCloseMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders dialog with correct title when open", () => {
    // Arrange & Act
    render(
      <CustomerTypeMetadataDialog
        open={true}
        onClose={onCloseMock}
        customerType={mockCustomerType}
      />,
    );

    // Assert
    expect(screen.getByText("Customer Type Metadata")).toBeInTheDocument();
  });

  it("does not render when open is false", () => {
    // Arrange & Act
    render(
      <CustomerTypeMetadataDialog
        open={false}
        onClose={onCloseMock}
        customerType={mockCustomerType}
      />,
    );

    // Assert
    expect(screen.queryByText("Customer Type Metadata")).not.toBeInTheDocument();
  });

  it("closes when user clicks close button", () => {
    // Arrange
    render(
      <CustomerTypeMetadataDialog
        open={true}
        onClose={onCloseMock}
        customerType={mockCustomerType}
      />,
    );

    // Act
    fireEvent.click(screen.getByTestId("back"));

    // Assert
    expect(onCloseMock).toHaveBeenCalled();
  });

  it("renders with undefined customer type", () => {
    // Arrange & Act
    render(
      <CustomerTypeMetadataDialog open={true} onClose={onCloseMock} customerType={undefined} />,
    );

    // Assert
    expect(screen.getByText("Customer Type Metadata")).toBeInTheDocument();
  });

  it("displays metadata when section is expanded", () => {
    // Arrange
    render(
      <CustomerTypeMetadataDialog
        open={true}
        onClose={onCloseMock}
        customerType={mockCustomerType}
      />,
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
  });
});
