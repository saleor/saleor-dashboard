import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";

import { Link } from "../Link";
import TableRowLink from "./TableRowLink";
import { TableRowLinkCheckbox } from "./TableRowLinkCheckbox";

// Radix mounts a hidden input inside <form>; jsdom has no ResizeObserver.
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

const listPath = "/model-types/1";

describe("TableRowLinkCheckbox", () => {
  it("toggles inside a form without following the name link", async () => {
    // Arrange
    const user = userEvent.setup();
    const onCheckedChange = jest.fn();
    const history = createMemoryHistory({ initialEntries: [listPath] });

    render(
      <Router history={history}>
        <form>
          <table>
            <tbody>
              <TableRowLink>
                <td>
                  <TableRowLinkCheckbox checked={false} onCheckedChange={onCheckedChange} />
                </td>
                <td>
                  <Link href="/attributes/1" color="secondary">
                    Author
                  </Link>
                </td>
              </TableRowLink>
            </tbody>
          </table>
        </form>
      </Router>,
      { wrapper: Wrapper },
    );

    // Act
    await user.click(screen.getByRole("checkbox"));

    // Assert
    expect(onCheckedChange).toHaveBeenCalledTimes(1);
    expect(history.location.pathname).toBe(listPath);
  });
});
