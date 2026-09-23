import { type Ripple as RippleModel } from "@dashboard/ripples/types";
import { ThemeProvider } from "@saleor/macaw-ui-next";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { defineMessage } from "react-intl";

import { Ripple } from "./Ripple";

const mockSetFirstSeenFlag = jest.fn();
const mockSetManuallyHidden = jest.fn();
const mockGetShouldShow = jest.fn();

jest.mock("@dashboard/ripples/hooks/useRipplesStorage", () => ({
  useRippleStorage: (): Record<string, jest.Mock> => ({
    getShouldShow: mockGetShouldShow,
    setFirstSeenFlag: mockSetFirstSeenFlag,
    setManuallyHidden: mockSetManuallyHidden,
  }),
}));

const model: RippleModel = {
  type: "feature",
  ID: "test-ripple",
  TTL_seconds: 3600,
  dateAdded: new Date("2026-08-20"),
  content: {
    oneLiner: "Customer types",
    contextual: "Group customers into types.",
    global: "Customer types are available.",
  },
};

const renderRipple = (ripple: RippleModel = model): ReturnType<typeof render> =>
  render(
    <ThemeProvider>
      <Ripple model={ripple} />
    </ThemeProvider>,
  );

describe("Ripple", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetShouldShow.mockReturnValue(true);
  });

  it("hides ripples that should not be shown", () => {
    // Arrange
    mockGetShouldShow.mockReturnValue(false);

    // Act
    renderRipple();

    // Assert
    expect(screen.queryByRole("button", { name: "Learn about Customer types" })).toBeNull();
  });

  it("shows the contextual hint and records the first open", async () => {
    // Arrange
    const user = userEvent.setup();

    renderRipple();

    // Act
    await user.click(screen.getByRole("button", { name: "Learn about Customer types" }));

    // Assert
    expect(screen.getByText("Group customers into types.")).toBeVisible();
    expect(mockSetFirstSeenFlag).toHaveBeenCalledWith(model);
    expect(screen.getByRole("button", { name: "Dismiss" })).toBeVisible();
  });

  it("dismisses the hint", async () => {
    // Arrange
    const user = userEvent.setup();

    renderRipple();
    await user.click(screen.getByRole("button", { name: "Learn about Customer types" }));

    // Act
    await user.click(screen.getByRole("button", { name: "Dismiss" }));

    // Assert
    expect(mockSetManuallyHidden).toHaveBeenCalledWith(model);
  });

  it("opens an action URL and dismisses the hint", async () => {
    // Arrange
    const user = userEvent.setup();
    const open = jest.spyOn(window, "open").mockImplementation(() => null);
    const actionModel: RippleModel = {
      ...model,
      actions: [
        {
          label: defineMessage({ id: "tfplrt", defaultMessage: "Set up types" }),
          href: "/customer-types",
        },
      ],
    };

    renderRipple(actionModel);
    await user.click(screen.getByRole("button", { name: "Learn about Customer types" }));

    // Act
    await user.click(screen.getByRole("button", { name: "Set up types" }));

    // Assert
    expect(mockSetManuallyHidden).toHaveBeenCalledWith(actionModel);
    expect(open).toHaveBeenCalledWith("/customer-types", "_blank", "noopener,noreferrer");
    open.mockRestore();
  });

  it("runs an in-app action and dismisses the hint", async () => {
    // Arrange
    const user = userEvent.setup();
    const onClick = jest.fn();
    const actionModel: RippleModel = {
      ...model,
      actions: [{ label: defineMessage({ id: "3eR8iC", defaultMessage: "Show me" }), onClick }],
    };

    renderRipple(actionModel);
    await user.click(screen.getByRole("button", { name: "Learn about Customer types" }));

    // Act
    await user.click(screen.getByRole("button", { name: "Show me" }));

    // Assert
    expect(mockSetManuallyHidden).toHaveBeenCalledWith(actionModel);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
