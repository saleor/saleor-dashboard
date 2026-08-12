import { history } from "@dashboard/components/Router";
import { stringifyQs } from "@dashboard/utils/urls";

import createDialogActionHandlers from "./dialogActionHandlers";

describe("createDialogActionHandlers", () => {
  const buildUrl = (params: Record<string, unknown>) => `/orders/1?${JSON.stringify(params)}`;

  it("preserves lineId when opening fulfillment metadata modal", () => {
    // Arrange
    const navigate = jest.fn();
    const params = { lineId: "line-1" };
    const [openModal] = createDialogActionHandlers(navigate, buildUrl, params);

    // Act
    openModal("view-fulfillment-metadata", { id: "fulfillment-1" });

    // Assert
    expect(navigate).toHaveBeenCalledWith(
      buildUrl({
        lineId: "line-1",
        id: "fulfillment-1",
        action: "view-fulfillment-metadata",
      }),
    );
  });

  it("preserves lineId when closing a modal", () => {
    // Arrange
    const navigate = jest.fn();
    const params = {
      lineId: "line-1",
      action: "edit-fulfillment",
      id: "fulfillment-1",
    };
    const [, closeModal] = createDialogActionHandlers(navigate, buildUrl, params);

    // Act
    closeModal();

    // Assert
    expect(navigate).toHaveBeenCalledWith(
      buildUrl({
        lineId: "line-1",
        action: undefined,
        id: undefined,
        ids: undefined,
      }),
      { replace: true },
    );
  });

  it("keeps current pathname encoding and non-dialog query params when opening a dialog", () => {
    // Arrange - GraphQL ids often end in "="; url helpers encode them as %3D
    const originalLocation = history.location;

    history.location = {
      ...originalLocation,
      pathname: "/products/UHJvZHVjdDox==",
      search: "?action=setup&foo=bar",
    };

    const navigate = jest.fn();
    const buildProductUrl = (params: Record<string, unknown>) =>
      `/products/UHJvZHVjdDox%3D%3D?${stringifyQs(params)}`;
    const [openModal] = createDialogActionHandlers(navigate, buildProductUrl, {
      action: "setup",
    });

    try {
      // Act
      openModal("remove");

      // Assert
      expect(navigate).toHaveBeenCalledWith(
        `/products/UHJvZHVjdDox==?${stringifyQs({ foo: "bar", action: "remove" })}`,
      );
    } finally {
      history.location = originalLocation;
    }
  });
});
