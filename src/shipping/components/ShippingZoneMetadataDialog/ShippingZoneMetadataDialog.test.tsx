import { type ShippingZoneQuery } from "@dashboard/graphql";
import { shippingZone } from "@dashboard/shipping/fixtures";
import { fireEvent, render, screen, within } from "@testing-library/react";

import { ShippingZoneMetadataDialog } from "./ShippingZoneMetadataDialog";

const mockOnSubmit = jest.fn();

jest.mock("@dashboard/components/MetadataDialog/useHandleMetadataSubmit", () => ({
  useHandleMetadataSubmit: jest.fn(() => ({
    onSubmit: mockOnSubmit,
    lastSubmittedData: undefined,
    submitInProgress: false,
  })),
}));

const mockShippingZone = {
  ...shippingZone!,
  metadata: [{ key: "test-key", value: "test-value", __typename: "MetadataItem" as const }],
  privateMetadata: [
    { key: "private-key", value: "private-value", __typename: "MetadataItem" as const },
  ],
} satisfies NonNullable<ShippingZoneQuery["shippingZone"]>;

describe("ShippingZoneMetadataDialog", () => {
  const onCloseMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders dialog with correct title when open", () => {
    // Arrange & Act
    render(
      <ShippingZoneMetadataDialog
        open={true}
        onClose={onCloseMock}
        shippingZone={mockShippingZone}
      />,
    );

    // Assert
    expect(screen.getByText("Shipping Zone Metadata")).toBeInTheDocument();
  });

  it("does not render when open is false", () => {
    // Arrange & Act
    render(
      <ShippingZoneMetadataDialog
        open={false}
        onClose={onCloseMock}
        shippingZone={mockShippingZone}
      />,
    );

    // Assert
    expect(screen.queryByText("Shipping Zone Metadata")).not.toBeInTheDocument();
  });

  it("closes when user clicks close button", () => {
    // Arrange
    render(
      <ShippingZoneMetadataDialog
        open={true}
        onClose={onCloseMock}
        shippingZone={mockShippingZone}
      />,
    );

    // Act
    fireEvent.click(screen.getByTestId("back"));

    // Assert
    expect(onCloseMock).toHaveBeenCalled();
  });

  it("renders with undefined shipping zone", () => {
    // Arrange & Act
    render(
      <ShippingZoneMetadataDialog open={true} onClose={onCloseMock} shippingZone={undefined} />,
    );

    // Assert
    expect(screen.getByText("Shipping Zone Metadata")).toBeInTheDocument();
  });

  it("displays metadata when section is expanded", () => {
    // Arrange
    render(
      <ShippingZoneMetadataDialog
        open={true}
        onClose={onCloseMock}
        shippingZone={mockShippingZone}
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
    expect(within(publicMetadataEditor).getByDisplayValue("test-value")).toBeInTheDocument();
  });

  it("displays private metadata when section is expanded", () => {
    // Arrange
    render(
      <ShippingZoneMetadataDialog
        open={true}
        onClose={onCloseMock}
        shippingZone={mockShippingZone}
      />,
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
