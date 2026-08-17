import { commonStatusMessages } from "@dashboard/intl";
import { testIntlInstance } from "@test/intl";

import { getStaffMemberStatusDisplay, isStaffInvitePending } from "./staffMemberStatus";
import { staffMemberStatusMessages } from "./staffMemberStatusMessages";

describe("getStaffMemberStatusDisplay", () => {
  it("returns Active when the member is active and has signed in", () => {
    // Arrange / Act
    const result = getStaffMemberStatusDisplay({
      isActive: true,
      invitePending: false,
      intl: testIntlInstance,
    });

    // Assert
    expect(result).toEqual({
      label: testIntlInstance.formatMessage(commonStatusMessages.active),
      dot: "success",
    });
  });

  it("returns Pending invite when active but never signed in", () => {
    // Arrange / Act
    const result = getStaffMemberStatusDisplay({
      isActive: true,
      invitePending: true,
      intl: testIntlInstance,
    });

    // Assert
    expect(result).toEqual({
      label: testIntlInstance.formatMessage(staffMemberStatusMessages.pendingInvite),
      dot: "warning",
    });
  });

  it("returns Not active when the member is deactivated", () => {
    // Arrange / Act
    const result = getStaffMemberStatusDisplay({
      isActive: false,
      invitePending: true,
      intl: testIntlInstance,
    });

    // Assert
    expect(result).toEqual({
      label: testIntlInstance.formatMessage(commonStatusMessages.notActive),
      dot: "neutral",
    });
  });
});

describe("isStaffInvitePending", () => {
  it("is pending when lastLogin is null", () => {
    // Arrange / Act / Assert
    expect(isStaffInvitePending({ lastLogin: null })).toBe(true);
  });

  it("is not pending after the member has signed in", () => {
    // Arrange / Act / Assert
    expect(isStaffInvitePending({ lastLogin: "2026-01-01T00:00:00+00:00" })).toBe(false);
  });

  it("is not pending when lastLogin is unavailable", () => {
    // Arrange / Act / Assert
    expect(isStaffInvitePending({ id: "1" } as any)).toBe(false);
  });
});
