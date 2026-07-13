import { PermissionEnum } from "@dashboard/graphql";

import {
  getDebugStaffProfileStatus,
  getDebugStaffProfileStatusLabel,
} from "./debugStaffProfileStatus";
import { type DebugStaffProfile } from "./debugStaffProfileStore";

const baseProfile: DebugStaffProfile = {
  baseEmail: "admin@saleor.io",
  debugEmail: "admin+debugdev-12345678@saleor.io",
  hash: "12345678",
  permissions: [PermissionEnum.MANAGE_ORDERS],
  staffCreated: false,
  lastUsedAt: "2026-01-01T00:00:00.000Z",
};

describe("getDebugStaffProfileStatus", () => {
  it("returns needs-password when staff invite is pending", () => {
    // Arrange // Act // Assert
    expect(getDebugStaffProfileStatus(baseProfile)).toBe("needs-password");
    expect(getDebugStaffProfileStatusLabel("needs-password")).toBe("Needs password");
  });

  it("returns ready-to-login when staff exists", () => {
    // Arrange // Act // Assert
    expect(getDebugStaffProfileStatus({ ...baseProfile, staffCreated: true })).toBe(
      "ready-to-login",
    );
    expect(getDebugStaffProfileStatusLabel("ready-to-login")).toBe("Ready to log in");
  });
});
