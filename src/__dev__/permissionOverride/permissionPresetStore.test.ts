import { PermissionEnum } from "@dashboard/graphql";

import { permissionPresetStore } from "./permissionPresetStore";

const samplePreset = {
  hash: "abc12345",
  name: "Orders only",
  permissions: [PermissionEnum.MANAGE_ORDERS],
  savedAt: "2026-01-01T00:00:00.000Z",
};

describe("permissionPresetStore", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("prevents saving a preset with the same permission hash", () => {
    // Arrange
    expect(permissionPresetStore.upsert(samplePreset)).toBe(true);

    // Act
    const saved = permissionPresetStore.upsert({
      ...samplePreset,
      name: "Different label",
      savedAt: "2026-01-02T00:00:00.000Z",
    });

    // Assert
    expect(saved).toBe(false);
    expect(permissionPresetStore.getAll()).toHaveLength(1);
    expect(permissionPresetStore.getByHash("abc12345")?.name).toBe("Orders only");
  });
});
