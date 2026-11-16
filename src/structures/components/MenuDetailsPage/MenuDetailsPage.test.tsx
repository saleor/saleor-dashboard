import { type MenuDetailsFragment } from "@dashboard/graphql";
import { menu } from "@dashboard/structures/fixtures";
import { ThemeWrapper } from "@test/themeWrapper";
import { render, type RenderResult, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { IntlProvider } from "react-intl";
import { MemoryRouter } from "react-router-dom";

import MenuDetailsPage from "./MenuDetailsPage";

// The real Savebar renders into a portal the AppLayout provides.
jest.mock("@dashboard/components/Savebar");
// The "Open in GraphiQL" action reads the Dev Mode context, which is only provided at the app root.
jest.mock("@dashboard/components/DevModePanel/hooks", () => ({
  useDevModeContext: (): Record<string, jest.Mock> => ({
    setDevModeContent: jest.fn(),
    setVariables: jest.fn(),
    setDevModeVisibility: jest.fn(),
  }),
}));
jest.mock("@dashboard/extensions/hooks/useExtensions", () => ({
  useExtensions: (): { MENU_DETAILS_MORE_ACTIONS: [] } => ({ MENU_DETAILS_MORE_ACTIONS: [] }),
}));
// The sortable item tree is not what these tests are about.
jest.mock("../MenuItems/MenuItems", () => ({
  __esModule: true,
  default: (): React.ReactNode => <div data-test-id="menu-items-mock" />,
}));

const Wrapper = ({ children }: { children: ReactNode }): React.ReactNode => (
  <MemoryRouter>
    <IntlProvider defaultLocale="en" locale="en">
      <ThemeWrapper>{children}</ThemeWrapper>
    </IntlProvider>
  </MemoryRouter>
);

const renderPage = ({
  structure,
  disabled,
  onShowMetadata,
}: {
  structure: MenuDetailsFragment | undefined;
  disabled: boolean;
  onShowMetadata: () => void;
}): RenderResult =>
  render(
    <MenuDetailsPage
      disabled={disabled}
      errors={[]}
      menu={structure}
      saveButtonState="default"
      onDelete={jest.fn()}
      onItemAdd={jest.fn()}
      onItemClick={jest.fn()}
      onItemEdit={jest.fn()}
      onShowMetadata={onShowMetadata}
      onSubmit={jest.fn()}
    />,
    { wrapper: Wrapper },
  );

describe("MenuDetailsPage — structure metadata", () => {
  it("opens the structure metadata editor from the top bar", async () => {
    // Arrange
    const onShowMetadata = jest.fn();

    renderPage({ structure: menu, disabled: false, onShowMetadata });

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Edit structure metadata" }));

    // Assert
    expect(onShowMetadata).toHaveBeenCalledTimes(1);
  });

  it.each([
    { state: "the page is loading or saving", structure: menu, disabled: true },
    { state: "no structure has loaded", structure: undefined, disabled: false },
  ])("does not open the editor while $state", async ({ structure, disabled }) => {
    // Arrange
    const onShowMetadata = jest.fn();

    renderPage({ structure, disabled, onShowMetadata });

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Edit structure metadata" }));

    // Assert
    expect(onShowMetadata).not.toHaveBeenCalled();
  });
});
