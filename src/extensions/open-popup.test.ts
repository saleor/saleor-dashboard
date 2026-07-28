import {
  findOpenPopupExtension,
  OPEN_POPUP_MAX_PARAMS_LENGTH,
  validateOpenPopupParams,
} from "./open-popup";
import { type Extension } from "./types";

const makeExtension = (overrides: Partial<Extension>): Extension => ({
  id: "ext-1",
  app: {
    __typename: "App",
    id: "app-1",
    appUrl: "https://app.example.com",
    name: "Test app",
    brand: null,
  },
  accessToken: "token",
  permissions: [],
  label: "Extension",
  identifier: "main-popup",
  mountName: "ORDER_DETAILS_WIDGETS",
  url: "https://app.example.com/popup",
  open: () => undefined,
  targetName: "POPUP",
  settings: {},
  isSaleorOfficial: false,
  fromCache: false,
  ...overrides,
});

describe("validateOpenPopupParams", () => {
  it("accepts an absent payload", () => {
    // Act
    const result = validateOpenPopupParams(undefined);

    // Assert
    expect(result).toEqual({ ok: true });
  });

  it("accepts an already-serialized string payload", () => {
    // Act
    const result = validateOpenPopupParams("eyJtb2RlIjoiZnVsbCJ9");

    // Assert
    expect(result).toEqual({ ok: true });
  });

  it("rejects a payload over the size cap", () => {
    // Act
    const result = validateOpenPopupParams("x".repeat(OPEN_POPUP_MAX_PARAMS_LENGTH + 1));

    // Assert
    expect(result.ok).toBe(false);
  });
});

describe("findOpenPopupExtension", () => {
  const target = { requestingAppId: "app-1", extensionIdentifier: "main-popup" };

  it("finds the matching same-app POPUP extension", () => {
    // Arrange
    const match = makeExtension({});
    const extensions = [makeExtension({ identifier: "other" }), match];

    // Act + Assert
    expect(findOpenPopupExtension(extensions, target)).toBe(match);
  });

  it("ignores extensions belonging to another app", () => {
    // Arrange
    const extensions = [makeExtension({ app: { ...makeExtension({}).app, id: "app-2" } })];

    // Act + Assert
    expect(findOpenPopupExtension(extensions, target)).toBeUndefined();
  });

  it("ignores extensions whose target is not POPUP", () => {
    // Arrange
    const extensions = [makeExtension({ targetName: "WIDGET" })];

    // Act + Assert
    expect(findOpenPopupExtension(extensions, target)).toBeUndefined();
  });

  it("ignores extensions with a different identifier", () => {
    // Arrange
    const extensions = [makeExtension({ identifier: "something-else" })];

    // Act + Assert
    expect(findOpenPopupExtension(extensions, target)).toBeUndefined();
  });
});
