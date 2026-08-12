import { type StaffMemberDetailsFragment } from "@dashboard/graphql";
import { staffMember as staffMemberFixture } from "@dashboard/staff/fixtures";
import { fireEvent, render, screen, within } from "@testing-library/react";

import { StaffMetadataDialog } from "./StaffMetadataDialog";

const mockOnSubmit = jest.fn();

jest.mock("@dashboard/components/MetadataDialog/useHandleMetadataSubmit", () => ({
  useHandleMetadataSubmit: jest.fn(() => ({
    onSubmit: mockOnSubmit,
    lastSubmittedData: undefined,
    submitInProgress: false,
  })),
}));

const mockStaffMember: StaffMemberDetailsFragment = {
  ...staffMemberFixture,
  metadata: [{ __typename: "MetadataItem", key: "test-key", value: "test-value" }],
  privateMetadata: [{ __typename: "MetadataItem", key: "private-key", value: "private-value" }],
};

describe("StaffMetadataDialog", () => {
  const onCloseMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders dialog with correct title when open", () => {
    // Arrange & Act
    render(<StaffMetadataDialog open={true} onClose={onCloseMock} staffMember={mockStaffMember} />);

    // Assert
    expect(screen.getByText("Staff member metadata")).toBeInTheDocument();
  });

  it("does not render when open is false", () => {
    // Arrange & Act
    render(
      <StaffMetadataDialog open={false} onClose={onCloseMock} staffMember={mockStaffMember} />,
    );

    // Assert
    expect(screen.queryByText("Staff member metadata")).not.toBeInTheDocument();
  });

  it("closes when user clicks close button", () => {
    // Arrange
    render(<StaffMetadataDialog open={true} onClose={onCloseMock} staffMember={mockStaffMember} />);

    // Act
    fireEvent.click(screen.getByTestId("back"));

    // Assert
    expect(onCloseMock).toHaveBeenCalled();
  });

  it("renders with undefined staff member", () => {
    // Arrange & Act
    render(<StaffMetadataDialog open={true} onClose={onCloseMock} staffMember={undefined} />);

    // Assert
    expect(screen.getByText("Staff member metadata")).toBeInTheDocument();
  });

  it("displays metadata when section is expanded", () => {
    // Arrange
    render(<StaffMetadataDialog open={true} onClose={onCloseMock} staffMember={mockStaffMember} />);

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
    render(<StaffMetadataDialog open={true} onClose={onCloseMock} staffMember={mockStaffMember} />);

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
