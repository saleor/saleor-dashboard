import { render, type RenderResult, screen } from "@testing-library/react";
import { IntlProvider } from "react-intl";

import { BulkDeleteButton } from "./BulkDeleteButton";

const renderButton = (count: number): RenderResult =>
  render(
    <IntlProvider locale="en">
      <BulkDeleteButton count={count} onClick={jest.fn()}>
        Delete products
      </BulkDeleteButton>
    </IntlProvider>,
  );

describe("BulkDeleteButton", () => {
  it("shows the action label and selected count", () => {
    // Arrange & Act
    renderButton(5);

    // Assert
    expect(screen.getByRole("button", { name: "Delete products (5)" })).toBeInTheDocument();
  });
});
