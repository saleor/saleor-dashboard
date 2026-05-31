import { type ProductDetailsQuery } from "@dashboard/graphql";
import { product } from "@dashboard/products/fixtures";
import { fireEvent, render, screen, within } from "@testing-library/react";

import { ProductMetadataDialog } from "./ProductMetadataDialog";

const mockOnSubmit = jest.fn();

jest.mock("@dashboard/components/MetadataDialog/useHandleMetadataSubmit", () => ({
  useHandleMetadataSubmit: jest.fn(() => ({
    onSubmit: mockOnSubmit,
    lastSubmittedData: undefined,
    submitInProgress: false,
  })),
}));

const placeholderImage = "image.jpg";
const mockProduct = product(placeholderImage) as unknown as NonNullable<
  ProductDetailsQuery["product"]
>;

describe("ProductMetadataDialog", () => {
  const onCloseMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders dialog with correct title when open", () => {
    // Arrange & Act
    render(<ProductMetadataDialog open={true} onClose={onCloseMock} product={mockProduct} />);

    // Assert
    expect(screen.getByText("Product Metadata")).toBeInTheDocument();
  });

  it("does not render when open is false", () => {
    // Arrange & Act
    render(<ProductMetadataDialog open={false} onClose={onCloseMock} product={mockProduct} />);

    // Assert
    expect(screen.queryByText("Product Metadata")).not.toBeInTheDocument();
  });

  it("closes when user clicks close button", () => {
    // Arrange
    render(<ProductMetadataDialog open={true} onClose={onCloseMock} product={mockProduct} />);

    // Act
    fireEvent.click(screen.getByTestId("back"));

    // Assert
    expect(onCloseMock).toHaveBeenCalled();
  });

  it("displays metadata when section is expanded", () => {
    // Arrange
    render(<ProductMetadataDialog open={true} onClose={onCloseMock} product={mockProduct} />);

    const metadataEditors = screen.getAllByTestId("metadata-editor");
    const publicMetadataEditor = metadataEditors.find(
      editor => editor.getAttribute("data-test-is-private") === "false",
    )!;

    // Act
    fireEvent.click(within(publicMetadataEditor).getByTestId("expand"));

    // Assert
    expect(within(publicMetadataEditor).getByDisplayValue("integration.id")).toBeInTheDocument();
    expect(within(publicMetadataEditor).getByDisplayValue("100023123")).toBeInTheDocument();
  });

  it("normalizes missing privateMetadata to empty list", () => {
    // Arrange
    const { privateMetadata: _omitted, ...productWithoutPrivateMetadata } = mockProduct;

    // Act
    render(
      <ProductMetadataDialog
        open={true}
        onClose={onCloseMock}
        product={
          productWithoutPrivateMetadata as unknown as NonNullable<ProductDetailsQuery["product"]>
        }
      />,
    );

    // Assert
    expect(screen.getAllByTestId("metadata-editor")).toHaveLength(2);
  });
});
