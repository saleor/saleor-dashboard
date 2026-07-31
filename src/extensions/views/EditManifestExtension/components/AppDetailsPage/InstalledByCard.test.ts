import { type AppQuery } from "@dashboard/graphql";

import { getInstaller } from "./InstalledByCard";

type AppTokens = NonNullable<NonNullable<AppQuery["app"]>["tokens"]>;

const user = (email: string): AppTokens[number]["createdBy"] => ({
  __typename: "User",
  id: email,
  email,
  firstName: "",
  lastName: "",
});

const token = (id: string, createdAt: string | null, email?: string): AppTokens[number] => ({
  __typename: "AppToken",
  id,
  name: id,
  authToken: "1234",
  createdAt,
  createdBy: email ? user(email) : null,
});

describe("getInstaller", () => {
  it("returns the author of the oldest attributed token", () => {
    // Arrange
    const tokens: AppTokens = [
      token("newer", "2026-02-01T10:00:00Z", "later@example.com"),
      token("oldest", "2026-01-01T10:00:00Z", "installer@example.com"),
    ];

    // Act
    const installer = getInstaller(tokens);

    // Assert
    expect(installer.createdBy?.email).toBe("installer@example.com");
  });

  it("skips tokens without creation data (older Saleor versions, missing MANAGE_STAFF)", () => {
    // Arrange
    const tokens: AppTokens = [
      token("untracked", null),
      token("no-author", "2025-01-01T10:00:00Z"),
      token("tracked", "2026-01-01T10:00:00Z", "installer@example.com"),
    ];

    // Act
    const installer = getInstaller(tokens);

    // Assert
    expect(installer.id).toBe("tracked");
  });

  it("returns undefined when nothing is attributed", () => {
    // Arrange // Act // Assert
    expect(getInstaller([token("untracked", null)])).toBeUndefined();
  });
});
