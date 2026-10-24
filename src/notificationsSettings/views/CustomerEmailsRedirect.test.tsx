import { CUSTOMER_EMAILS_APP_IDENTIFIER } from "@dashboard/notificationsSettings/constants";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route } from "react-router-dom";

import { CustomerEmailsRedirectView } from "./CustomerEmailsRedirect";

describe("CustomerEmailsRedirectView", () => {
  it("sends the merchant to the official Customer Emails app URL", () => {
    // Arrange & Act
    render(
      <MemoryRouter initialEntries={["/notifications-settings/customer"]}>
        <Route path="/notifications-settings/customer" component={CustomerEmailsRedirectView} />
        <Route render={({ location }) => <div data-test-id="location">{location.pathname}</div>} />
      </MemoryRouter>,
    );

    // Assert
    expect(screen.getByTestId("location")).toHaveTextContent(
      `/extensions/app/${CUSTOMER_EMAILS_APP_IDENTIFIER}`,
    );
  });
});
