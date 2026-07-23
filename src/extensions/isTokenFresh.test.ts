import { isTokenFresh } from "./isTokenFresh";

// Minimal unsigned JWT: only the payload segment matters to jwt-decode.
const makeJwt = (payload: Record<string, unknown>): string => {
  const base64url = (obj: Record<string, unknown>) =>
    Buffer.from(JSON.stringify(obj)).toString("base64url");

  return `${base64url({ alg: "none" })}.${base64url(payload)}.sig`;
};

const nowSeconds = () => Math.floor(Date.now() / 1000);

describe("isTokenFresh", () => {
  it("returns true for a token expiring well in the future", () => {
    // Arrange
    const token = makeJwt({ exp: nowSeconds() + 3600 });

    // Act + Assert
    expect(isTokenFresh(token)).toBe(true);
  });

  it("returns false for an already-expired token", () => {
    // Arrange
    const token = makeJwt({ exp: nowSeconds() - 10 });

    // Act + Assert
    expect(isTokenFresh(token)).toBe(false);
  });

  it("returns false for a token expiring inside the safety margin", () => {
    // Arrange - expires in 2s, default margin is 5s
    const token = makeJwt({ exp: nowSeconds() + 2 });

    // Act + Assert
    expect(isTokenFresh(token)).toBe(false);
  });

  it("returns true when the token has no exp claim", () => {
    // Arrange
    const token = makeJwt({ sub: "app" });

    // Act + Assert
    expect(isTokenFresh(token)).toBe(true);
  });

  it("returns true for an undecodable token instead of blocking", () => {
    // Act + Assert
    expect(isTokenFresh("not-a-jwt")).toBe(true);
  });
});
