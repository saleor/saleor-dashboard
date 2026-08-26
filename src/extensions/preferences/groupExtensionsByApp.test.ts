import { groupExtensionsByApp } from "./groupExtensionsByApp";

const ext = (id: string, appId: string, appName: string) => ({
  id,
  identifier: id,
  label: id,
  app: { id: appId, identifier: appId, name: appName },
});

describe("groupExtensionsByApp", () => {
  it("groups extensions by app id", () => {
    // Arrange
    const list = [
      ext("a", "app1", "App One"),
      ext("b", "app2", "App Two"),
      ext("c", "app1", "App One"),
    ];

    // Act
    const groups = groupExtensionsByApp(list as never);

    // Assert
    expect(groups).toHaveLength(2);
    expect(groups[0].app.id).toBe("app1");
    expect(groups[0].extensions.map(e => e.id)).toEqual(["a", "c"]);
  });

  it("returns an empty array for no extensions (skips empty apps by construction)", () => {
    expect(groupExtensionsByApp([])).toEqual([]);
  });

  it("sorts groups by app name", () => {
    // Arrange
    const list = [ext("a", "app2", "Zebra"), ext("b", "app1", "Alpha")];

    // Act
    const groups = groupExtensionsByApp(list as never);

    // Assert
    expect(groups.map(g => g.app.name)).toEqual(["Alpha", "Zebra"]);
  });
});
