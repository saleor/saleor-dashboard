import { ThemeProvider } from "@saleor/macaw-ui-next";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { NotificationsHubPage } from "./NotificationsHubPage";

const useLegacySmtpAppHref = jest.fn();

jest.mock("@dashboard/notificationsSettings/hooks/useLegacySmtpAppHref", () => ({
  useLegacySmtpAppHref: (): string | null => useLegacySmtpAppHref(),
}));

const renderHub = (): void => {
  render(
    <ThemeProvider>
      <MemoryRouter>
        <NotificationsHubPage />
      </MemoryRouter>
    </ThemeProvider>,
  );
};

describe("NotificationsHubPage", () => {
  beforeEach(() => {
    useLegacySmtpAppHref.mockReset();
  });

  it("keeps Customer emails as a single card when the shop has no SMTP app", () => {
    // Arrange
    useLegacySmtpAppHref.mockReturnValue(null);

    // Act
    renderHub();

    // Assert
    expect(screen.getByTestId("notifications-customer-smtp-link")).toHaveAttribute(
      "href",
      expect.stringContaining("/extensions/app/saleor.app.customer-emails"),
    );
    expect(screen.getByTestId("notifications-customer-smtp-link")).toHaveTextContent(
      "shopper's language",
    );
    expect(screen.queryByTestId("notifications-legacy-smtp-link")).not.toBeInTheDocument();
    expect(screen.queryByTestId("notifications-customer-emails")).not.toBeInTheDocument();
  });

  it("lists SMTP as a deprecated row on the Customer emails card when that app is installed", () => {
    // Arrange
    useLegacySmtpAppHref.mockReturnValue("/extensions/app/saleor.app.smtp");

    // Act
    renderHub();

    // Assert
    expect(screen.getByTestId("notifications-customer-emails")).toBeInTheDocument();
    expect(screen.getByTestId("notifications-customer-smtp-link")).toHaveAttribute(
      "href",
      expect.stringContaining("/extensions/app/saleor.app.customer-emails"),
    );
    expect(screen.getByTestId("notifications-customer-smtp-link")).toHaveTextContent(
      "shopper's language",
    );
    expect(screen.getByTestId("notifications-legacy-smtp-link")).toHaveAttribute(
      "href",
      expect.stringContaining("/extensions/app/saleor.app.smtp"),
    );
    expect(screen.getByTestId("deprecated-extension-badge")).toBeInTheDocument();
  });
});
