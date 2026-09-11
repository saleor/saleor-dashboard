import { type DocumentNode, Kind, visit } from "graphql";

import * as authMutations from "./mutations";

const getFragmentSpreads = (document: DocumentNode): string[] => {
  const spreads: string[] = [];

  visit(document, {
    [Kind.FRAGMENT_SPREAD]: node => {
      spreads.push(node.name.value);
    },
  });

  return spreads;
};

describe("auth mutations", () => {
  /**
   * Regression guard for the OIDC login break in 3.23.33.
   *
   * The `User` fragment pulls in `accessibleChannels { ...Channel }`, whose fields are
   * `PermissionsField(AUTHENTICATED_APP, AUTHENTICATED_STAFF_USER)` in Core. Only `tokenCreate`
   * assigns `info.context.user`, so it is the only auth mutation that can resolve them. Every
   * other auth mutation leaves the request unauthenticated during field resolution and would fail
   * with `PermissionDenied`, which the login screen reports as "You don't have permission to
   * login".
   */
  it("only requests the full User fragment from tokenCreate", () => {
    // Arrange
    const documents: Array<[string, DocumentNode]> = Object.entries(authMutations);

    // Act
    const withUserFragment = documents
      .filter(([, document]) => getFragmentSpreads(document).includes("User"))
      .map(([name]) => name);

    // Assert
    expect(withUserFragment).toEqual(["login"]);
  });
});
