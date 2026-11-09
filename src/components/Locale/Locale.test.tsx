import useLocale from "@dashboard/hooks/useLocale";
import { buttonMessages } from "@dashboard/intl";
import { render, screen } from "@testing-library/react";
import { useIntl } from "react-intl";

import { LocaleProvider } from "./Locale";

// Jest maps react-intl to a stub; these tests need the real provider, which throws on a language
// tag it can't use.
jest.mock("react-intl", () => jest.requireActual("react-intl/index.js"));

const LocalizedContent = (): React.ReactNode => {
  const intl = useIntl();
  const { locale } = useLocale();

  return (
    <>
      <span data-test-id="locale">{locale}</span>
      <span data-test-id="number">{intl.formatNumber(1234.5)}</span>
      <span data-test-id="message">{intl.formatMessage(buttonMessages.save)}</span>
    </>
  );
};

const renderWithSavedLocale = (saved: string): void => {
  localStorage.setItem("locale", saved);
  render(
    <LocaleProvider>
      <LocalizedContent />
    </LocaleProvider>,
  );
};

describe("LocaleProvider", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("uses the language the user saved", async () => {
    // Arrange & Act
    renderWithSavedLocale("pl");

    // Assert
    expect(await screen.findByText("Zapisz")).toBeInTheDocument();
    expect(screen.getByTestId("locale")).toHaveTextContent("pl");
    expect(screen.getByTestId("number")).toHaveTextContent("1234,5");
  });

  it.each(["undefined", "", "xx"])(
    "falls back to English when the saved language is %j, which the dashboard doesn't have",
    saved => {
      // Arrange & Act
      renderWithSavedLocale(saved);

      // Assert
      expect(screen.getByTestId("locale")).toHaveTextContent("en");
      expect(screen.getByTestId("number")).toHaveTextContent("1,234.5");
      expect(screen.getByTestId("message")).toHaveTextContent("Save");
    },
  );
});
