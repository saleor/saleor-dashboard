import { customer as customerFixture } from "@dashboard/customers/fixtures";
import { type CustomerDetailsQuery } from "@dashboard/graphql";
import { fireEvent, render, screen, within } from "@testing-library/react";

import { CustomerMetadataDialog } from "./CustomerMetadataDialog";

const mockOnSubmit = jest.fn();

jest.mock("@dashboard/components/MetadataDialog/useHandleMetadataSubmit", () => ({
  useHandleMetadataSubmit: jest.fn(() => ({
    onSubmit: mockOnSubmit,
    lastSubmittedData: undefined,
    submitInProgress: false,
  })),
}));

const mockCustomer: NonNullable<CustomerDetailsQuery["user"]> = {
  ...customerFixture!,
  metadata: [{ __typename: "MetadataItem", key: "test-key", value: "test-value" }],
  privateMetadata: [{ __typename: "MetadataItem", key: "private-key", value: "private-value" }],
};

describe("CustomerMetadataDialog", () => {
  const onCloseMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders dialog with correct title when open", () => {
    // Arrange & Act
    render(<CustomerMetadataDialog open={true} onClose={onCloseMock} customer={mockCustomer} />);

    // Assert
    expect(screen.getByText("Customer Metadata")).toBeInTheDocument();
  });

  it("does not render when open is false", () => {
    // Arrange & Act
    render(<CustomerMetadataDialog open={false} onClose={onCloseMock} customer={mockCustomer} />);

    // Assert
    expect(screen.queryByText("Customer Metadata")).not.toBeInTheDocument();
  });

  it("closes when user clicks close button", () => {
    // Arrange
    render(<CustomerMetadataDialog open={true} onClose={onCloseMock} customer={mockCustomer} />);

    // Act
    fireEvent.click(screen.getByTestId("back"));

    // Assert
    expect(onCloseMock).toHaveBeenCalled();
  });

  it("renders with undefined customer", () => {
    // Arrange & Act
    render(<CustomerMetadataDialog open={true} onClose={onCloseMock} customer={undefined} />);

    // Assert
    expect(screen.getByText("Customer Metadata")).toBeInTheDocument();
  });

  it("renders with null customer (post `NotFoundPage` short-circuit safety check)", () => {
    // Arrange & Act
    render(<CustomerMetadataDialog open={true} onClose={onCloseMock} customer={null} />);

    // Assert
    expect(screen.getByText("Customer Metadata")).toBeInTheDocument();
  });

  it("displays metadata when section is expanded", () => {
    // Arrange
    render(<CustomerMetadataDialog open={true} onClose={onCloseMock} customer={mockCustomer} />);

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

  it("displays private metadata when section is expanded", () => {
    // Arrange
    render(<CustomerMetadataDialog open={true} onClose={onCloseMock} customer={mockCustomer} />);

    const metadataEditors = screen.getAllByTestId("metadata-editor");
    const privateMetadataEditor = metadataEditors.find(
      editor => editor.getAttribute("data-test-is-private") === "true",
    )!;

    // Act
    fireEvent.click(within(privateMetadataEditor).getByTestId("expand"));

    // Assert
    expect(within(privateMetadataEditor).getByDisplayValue("private-key")).toBeInTheDocument();
    expect(within(privateMetadataEditor).getByDisplayValue("private-value")).toBeInTheDocument();
  });

  it("normalizes missing privateMetadata (MANAGE_STAFF gated field) to empty list", () => {
    // Arrange
    // `privateMetadata` is `@include(if: $PERMISSION_MANAGE_STAFF)` on the
    // customer query, so it can be absent. The dialog should still render
    // a (empty) private metadata section without crashing.
    // Strip the field rather than setting it to `undefined`: the fragment
    // types `privateMetadata` as optional, so omission is the realistic shape
    // the Apollo cache hands us when MANAGE_STAFF is denied.
    const { privateMetadata: _omitted, ...customerWithoutPrivateMetadata } = mockCustomer;

    // Act
    render(
      <CustomerMetadataDialog
        open={true}
        onClose={onCloseMock}
        customer={customerWithoutPrivateMetadata}
      />,
    );

    // Assert
    const metadataEditors = screen.getAllByTestId("metadata-editor");

    expect(metadataEditors.length).toBe(2);
  });
});
