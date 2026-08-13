import { isStaffDetailsFormPristine } from "./isStaffDetailsFormPristine";
import { type StaffDetailsFormData } from "./StaffDetailsPage";

const base: StaffDetailsFormData = {
  email: "a@example.com",
  firstName: "Ada",
  lastName: "Lovelace",
  permissionGroups: [
    { label: "Full Access", value: "1" },
    { label: "Editors", value: "2" },
  ],
};

describe("isStaffDetailsFormPristine", () => {
  it("is pristine when fields match", () => {
    // Arrange / Act / Assert
    expect(isStaffDetailsFormPristine(base, base)).toBe(true);
  });

  it("ignores permission group order", () => {
    // Arrange
    const reordered: StaffDetailsFormData = {
      ...base,
      permissionGroups: [...base.permissionGroups].reverse(),
    };

    // Act / Assert
    expect(isStaffDetailsFormPristine(reordered, base)).toBe(true);
  });

  it("is dirty when a field changes", () => {
    // Arrange / Act / Assert
    expect(isStaffDetailsFormPristine({ ...base, firstName: "Grace" }, base)).toBe(false);
  });

  it("is dirty when permission groups change", () => {
    // Arrange
    const updated: StaffDetailsFormData = {
      ...base,
      permissionGroups: [{ label: "Editors", value: "2" }],
    };

    // Act / Assert
    expect(isStaffDetailsFormPristine(updated, base)).toBe(false);
  });
});
