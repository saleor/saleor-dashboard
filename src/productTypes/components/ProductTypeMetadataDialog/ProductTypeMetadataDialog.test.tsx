import { type ProductTypeDetailsQuery } from "@dashboard/graphql";
import { productType } from "@dashboard/productTypes/fixtures";
import { fireEvent, render, screen, within } from "@testing-library/react";

import { ProductTypeMetadataDialog } from "./ProductTypeMetadataDialog";

const mockOnSubmit = jest.fn();

jest.mock("@dashboard/components/MetadataDialog/useHandleMetadataSubmit", () => ({
  useHandleMetadataSubmit: jest.fn(() => ({
    onSubmit: mockOnSubmit,
    lastSubmittedData: undefined,
    submitInProgress: false,
  })),
}));

const mockProductType: NonNullable<ProductTypeDetailsQuery["productType"]> = {
  ...productType!,
  metadata: [{ key: "test-key", value: "test-value", __typename: "MetadataItem" }],
  privateMetadata: [{ key: "private-key", value: "private-value", __typename: "MetadataItem" }],
};

describe("ProductTypeMetadataDialog", () => {
  const onCloseMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders dialog with correct title when open", () => {
    // Arrange & Act
    render(
      <ProductTypeMetadataDialog open={true} onClose={onCloseMock} productType={mockProductType} />,
    );

    // Assert
    expect(screen.getByText("Product Type Metadata")).toBeInTheDocument();
  });

  it("does not render when open is false", () => {
    // Arrange & Act
    render(
      <ProductTypeMetadataDialog
        open={false}
        onClose={onCloseMock}
        productType={mockProductType}
      />,
    );

    // Assert
    expect(screen.queryByText("Product Type Metadata")).not.toBeInTheDocument();
  });

  it("closes when user clicks close button", () => {
    // Arrange
    render(
      <ProductTypeMetadataDialog open={true} onClose={onCloseMock} productType={mockProductType} />,
    );

    // Act
    fireEvent.click(screen.getByTestId("back"));

    // Assert
    expect(onCloseMock).toHaveBeenCalled();
  });

  it("renders with undefined product type", () => {
    // Arrange & Act
    render(<ProductTypeMetadataDialog open={true} onClose={onCloseMock} productType={undefined} />);

    // Assert
    expect(screen.getByText("Product Type Metadata")).toBeInTheDocument();
  });

  it("displays metadata when section is expanded", () => {
    // Arrange
    render(
      <ProductTypeMetadataDialog open={true} onClose={onCloseMock} productType={mockProductType} />,
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
      <ProductTypeMetadataDialog open={true} onClose={onCloseMock} productType={mockProductType} />,
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
