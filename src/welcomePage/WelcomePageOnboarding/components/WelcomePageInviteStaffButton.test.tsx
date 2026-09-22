import { useUser } from "@dashboard/auth/useUser";
import { PermissionEnum } from "@dashboard/graphql";
import { useStaffInviteDialog } from "@dashboard/staff/components/StaffInviteProvider/StaffInviteProvider";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { WelcomePageInviteStaffButton } from "./WelcomePageInviteStaffButton";

jest.mock("@dashboard/auth/useUser");
jest.mock("@dashboard/staff/components/StaffInviteProvider/StaffInviteProvider", () => ({
  useStaffInviteDialog: jest.fn(),
}));

const useUserMock = useUser as jest.Mock;
const useStaffInviteDialogMock = useStaffInviteDialog as jest.Mock;

describe("WelcomePageInviteStaffButton", () => {
  it("opens the invite modal on the current page instead of navigating to staff", async () => {
    // Arrange
    const openInvite = jest.fn();
    const onClick = jest.fn();

    useUserMock.mockReturnValue({
      user: { userPermissions: [{ code: PermissionEnum.MANAGE_STAFF }] },
    });
    useStaffInviteDialogMock.mockReturnValue({ openInvite });

    // Act
    render(<WelcomePageInviteStaffButton onClick={onClick} />);
    await userEvent.click(screen.getByRole("button", { name: "Invite members" }));

    // Assert
    expect(onClick).toHaveBeenCalled();
    expect(openInvite).toHaveBeenCalled();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
