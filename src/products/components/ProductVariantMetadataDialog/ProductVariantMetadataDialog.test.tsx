import { type ProductVariantDetailsQuery } from "@dashboard/graphql";
import { variant } from "@dashboard/products/fixtures";
import { fireEvent, render, screen, within } from "@testing-library/react";

import { ProductVariantMetadataDialog } from "./ProductVariantMetadataDialog";

const mockOnSubmit = jest.fn();

jest.mock("@dashboard/components/MetadataDialog/useHandleMetadataSubmit", () => ({
  useHandleMetadataSubmit: jest.fn(() => ({
    onSubmit: mockOnSubmit,
    lastSubmittedData: undefined,
    submitInProgress: false,
  })),
}));

const placeholderImage = "image.jpg";
const mockVariant: NonNullable<ProductVariantDetailsQuery["productVariant"]> = {
  ...variant(placeholderImage),
  metadata: [{ __typename: "MetadataItem", key: "variant-key", value: "variant-value" }],
  privateMetadata: [{ __typename: "MetadataItem", key: "private-key", value: "private-value" }],
};

describe("ProductVariantMetadataDialog", () => {
  const onCloseMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders dialog with correct title when open", () => {
    // Arrange & Act
    render(
      <ProductVariantMetadataDialog open={true} onClose={onCloseMock} variant={mockVariant} />,
    );

    // Assert
    expect(screen.getByText("Variant Metadata")).toBeInTheDocument();
  });

  it("does not render when open is false", () => {
    // Arrange & Act
    render(
      <ProductVariantMetadataDialog open={false} onClose={onCloseMock} variant={mockVariant} />,
    );

    // Assert
    expect(screen.queryByText("Variant Metadata")).not.toBeInTheDocument();
  });

  it("closes when user clicks close button", () => {
    // Arrange
    render(
      <ProductVariantMetadataDialog open={true} onClose={onCloseMock} variant={mockVariant} />,
    );

    // Act
    fireEvent.click(screen.getByTestId("back"));

    // Assert
    expect(onCloseMock).toHaveBeenCalled();
  });

  it("displays metadata when section is expanded", () => {
    // Arrange
    render(
      <ProductVariantMetadataDialog open={true} onClose={onCloseMock} variant={mockVariant} />,
    );

    const metadataEditors = screen.getAllByTestId("metadata-editor");
    const publicMetadataEditor = metadataEditors.find(
      editor => editor.getAttribute("data-test-is-private") === "false",
    )!;

    // Act
    fireEvent.click(within(publicMetadataEditor).getByTestId("expand"));

    // Assert
    expect(within(publicMetadataEditor).getByDisplayValue("variant-key")).toBeInTheDocument();
    expect(within(publicMetadataEditor).getByDisplayValue("variant-value")).toBeInTheDocument();
  });

  it("normalizes missing privateMetadata to empty list", () => {
    // Arrange
    const { privateMetadata: _omitted, ...variantWithoutPrivateMetadata } = mockVariant;

    // Act
    render(
      <ProductVariantMetadataDialog
        open={true}
        onClose={onCloseMock}
        variant={
          variantWithoutPrivateMetadata as unknown as NonNullable<
            ProductVariantDetailsQuery["productVariant"]
          >
        }
      />,
    );

    // Assert
    expect(screen.getAllByTestId("metadata-editor")).toHaveLength(2);
  });
});
