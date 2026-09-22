import { StaffInviteProvider } from "@dashboard/staff/components/StaffInviteProvider/StaffInviteProvider";
import { ThemeProvider } from "@saleor/macaw-ui-next";
import { render, screen } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import { MemoryRouter } from "react-router-dom";

import { Actions } from "./Actions";

const renderActions = (query: string) =>
  render(
    <MemoryRouter>
      <IntlProvider defaultLocale="en" locale="en">
        <ThemeProvider>
          <StaffInviteProvider>
            <Actions query={query} onActionClick={() => undefined} />
          </StaffInviteProvider>
        </ThemeProvider>
      </IntlProvider>
    </MemoryRouter>,
  );

describe("Actions", () => {
  // useActionItems collects `.command-menu-item` nodes and moves `aria-selected`
  // onto them, and the combobox's aria-activedescendant points at their id — so
  // the option role has to sit on that same node, not on a child.
  it("puts the option role, id and class on a single node", () => {
    // Arrange & Act
    renderActions("go to orders");

    // Assert
    const option = screen.getByRole("option", { name: "Go to orders" });

    expect(option).toHaveClass("command-menu-item");
    expect(option.id).not.toHaveLength(0);
  });
});
