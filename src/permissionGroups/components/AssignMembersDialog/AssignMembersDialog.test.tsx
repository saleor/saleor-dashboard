import { type SearchStaffMembersQuery } from "@dashboard/graphql";
import { type RelayToFlat } from "@dashboard/types";
import Wrapper from "@test/wrapper";
import { fireEvent, render, screen } from "@testing-library/react";

import AssignMembersDialog from "./AssignMembersDialog";

const staffMembers: RelayToFlat<SearchStaffMembersQuery["search"]> = [
  {
    __typename: "User",
    id: "assigned",
    email: "assigned@example.com",
    firstName: "Assigned",
    lastName: "Member",
    isActive: true,
    avatar: null,
  },
  {
    __typename: "User",
    id: "available",
    email: "available@example.com",
    firstName: "Available",
    lastName: "Member",
    isActive: true,
    avatar: null,
  },
];

const defaultProps = {
  open: true,
  confirmButtonState: "default" as const,
  disabled: false,
  staffMembers,
  hasMore: false,
  loading: false,
  initialSearch: "",
  onClose: jest.fn(),
  onFetchMore: jest.fn(),
  onSearchChange: jest.fn(),
};

describe("AssignMembersDialog", () => {
  it("shows assigned members as checked and disabled and submits only new members", () => {
    // Arrange
    const onSubmit = jest.fn();

    render(
      <Wrapper>
        <AssignMembersDialog
          {...defaultProps}
          assignedMemberIds={[staffMembers[0].id]}
          onSubmit={onSubmit}
        />
      </Wrapper>,
    );

    const [assignedCheckbox, availableCheckbox] = screen.getAllByRole("checkbox");

    // Act
    fireEvent.click(availableCheckbox);
    fireEvent.click(screen.getByTestId("submit"));

    // Assert
    expect(assignedCheckbox).toBeChecked();
    expect(assignedCheckbox).toBeDisabled();
    expect(availableCheckbox).not.toBeDisabled();
    expect(onSubmit).toHaveBeenCalledWith([staffMembers[1]]);
  });

  it("allows a removed member to be assigned again", () => {
    // Arrange
    const onSubmit = jest.fn();

    render(
      <Wrapper>
        <AssignMembersDialog {...defaultProps} assignedMemberIds={[]} onSubmit={onSubmit} />
      </Wrapper>,
    );

    const [checkbox] = screen.getAllByRole("checkbox");

    // Act
    fireEvent.click(checkbox);
    fireEvent.click(screen.getByTestId("submit"));

    // Assert
    expect(checkbox).not.toBeDisabled();
    expect(onSubmit).toHaveBeenCalledWith([staffMembers[0]]);
  });

  it("does not submit selected members that have since been assigned", () => {
    // Arrange
    const onSubmit = jest.fn();
    const { rerender } = render(
      <Wrapper>
        <AssignMembersDialog {...defaultProps} onSubmit={onSubmit} />
      </Wrapper>,
    );

    // Act
    fireEvent.click(screen.getAllByRole("checkbox")[0]);
    rerender(
      <Wrapper>
        <AssignMembersDialog
          {...defaultProps}
          assignedMemberIds={[staffMembers[0].id]}
          onSubmit={onSubmit}
        />
      </Wrapper>,
    );
    fireEvent.click(screen.getByTestId("submit"));

    // Assert
    expect(onSubmit).toHaveBeenCalledWith([]);
  });
});
