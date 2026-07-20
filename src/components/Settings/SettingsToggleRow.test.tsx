import { ThemeProvider } from "@saleor/macaw-ui-next";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";

import { SettingsToggleRow } from "./SettingsToggleRow";

jest.mock("react-intl", () => ({
  FormattedMessage: ({ defaultMessage }: { defaultMessage: string }) => <>{defaultMessage}</>,
  useIntl: () => ({
    formatMessage: ({ defaultMessage }: { defaultMessage: string }) => defaultMessage,
  }),
}));

const renderRow = (props: Partial<Parameters<typeof SettingsToggleRow>[0]> = {}) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <ThemeProvider>{children}</ThemeProvider>
  );

  return render(
    <SettingsToggleRow
      name="legacy"
      title="Use legacy mode"
      description={
        <>
          Filtered by shipping zones.{" "}
          <a href="https://example.com/docs" target="_blank" rel="noreferrer">
            Learn more
          </a>
        </>
      }
      checked={false}
      onCheckedChange={jest.fn()}
      data-test-id="legacy-toggle"
      {...props}
    />,
    { wrapper },
  );
};

describe("SettingsToggleRow", () => {
  it("toggles when the row body is clicked", async () => {
    // Arrange
    const onCheckedChange = jest.fn();

    renderRow({ onCheckedChange });

    // Act
    await userEvent.click(screen.getByText("Use legacy mode"));

    // Assert
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("does not toggle when an embedded link is clicked", async () => {
    // Arrange
    const onCheckedChange = jest.fn();

    renderRow({ onCheckedChange });

    // Act
    await userEvent.click(screen.getByRole("link", { name: "Learn more" }));

    // Assert
    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});
