import { type ShippingZoneQuery } from "@dashboard/graphql";
import { shippingZone } from "@dashboard/shipping/fixtures";
import { fireEvent, render, screen, within } from "@testing-library/react";

import { ShippingMethodMetadataDialog } from "./ShippingMethodMetadataDialog";

const mockOnSubmit = jest.fn();

jest.mock("@dashboard/components/MetadataDialog/useHandleMetadataSubmit", () => ({
  useHandleMetadataSubmit: jest.fn(() => ({
    onSubmit: mockOnSubmit,
    lastSubmittedData: undefined,
    submitInProgress: false,
  })),
}));

const mockShippingMethod = {
  ...shippingZone!.shippingMethods![0],
  metadata: [{ key: "test-key", value: "test-value", __typename: "MetadataItem" as const }],
  privateMetadata: [
    { key: "private-key", value: "private-value", __typename: "MetadataItem" as const },
  ],
} satisfies NonNullable<NonNullable<ShippingZoneQuery["shippingZone"]>["shippingMethods"]>[number];

describe("ShippingMethodMetadataDialog", () => {
  const onCloseMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders dialog with correct title when open", () => {
    // Arrange & Act
    render(
      <ShippingMethodMetadataDialog
        open={true}
        onClose={onCloseMock}
        shippingMethod={mockShippingMethod}
      />,
    );

    // Assert
    expect(screen.getByText("Shipping Method Metadata")).toBeInTheDocument();
  });

  it("does not render when open is false", () => {
    // Arrange & Act
    render(
      <ShippingMethodMetadataDialog
        open={false}
        onClose={onCloseMock}
        shippingMethod={mockShippingMethod}
      />,
    );

    // Assert
    expect(screen.queryByText("Shipping Method Metadata")).not.toBeInTheDocument();
  });

  it("closes when user clicks close button", () => {
    // Arrange
    render(
      <ShippingMethodMetadataDialog
        open={true}
        onClose={onCloseMock}
        shippingMethod={mockShippingMethod}
      />,
    );

    // Act
    fireEvent.click(screen.getByTestId("back"));

    // Assert
    expect(onCloseMock).toHaveBeenCalled();
  });

  it("renders with undefined shipping method", () => {
    // Arrange & Act
    render(
      <ShippingMethodMetadataDialog open={true} onClose={onCloseMock} shippingMethod={undefined} />,
    );

    // Assert
    expect(screen.getByText("Shipping Method Metadata")).toBeInTheDocument();
  });

  it("displays metadata when section is expanded", () => {
    // Arrange
    render(
      <ShippingMethodMetadataDialog
        open={true}
        onClose={onCloseMock}
        shippingMethod={mockShippingMethod}
      />,
    );

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
    render(
      <ShippingMethodMetadataDialog
        open={true}
        onClose={onCloseMock}
        shippingMethod={mockShippingMethod}
      />,
    );

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
});
