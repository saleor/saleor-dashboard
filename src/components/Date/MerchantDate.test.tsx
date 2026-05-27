import { Locale, RawLocaleProvider } from "@dashboard/components/Locale";
import { TimezoneProvider } from "@dashboard/components/Timezone";
import { ThemeWrapper } from "@test/themeWrapper";
import { render, screen } from "@testing-library/react";
import { type ReactNode } from "react";
import { IntlProvider } from "react-intl";

import { MerchantDate } from "./MerchantDate";

// Smoke tests for the React glue around `getMerchantDate`. The pure function
// has its own behavioural coverage in MerchantDate.unit.test.ts; here we just
// want to catch regressions in the JSX wiring (locale + timezone consumers,
// the Tooltip composition, the trigger's `data-test-id`, the secondary color).
const renderInProviders = (node: ReactNode, tz = "UTC"): ReturnType<typeof render> =>
  render(
    <IntlProvider defaultLocale={Locale.EN} locale={Locale.EN}>
      <RawLocaleProvider value={{ locale: Locale.EN, setLocale: () => undefined }}>
        <TimezoneProvider value={tz}>
          <ThemeWrapper>{node}</ThemeWrapper>
        </TimezoneProvider>
      </RawLocaleProvider>
    </IntlProvider>,
  );

const now = new Date("2026-05-25T15:00:00Z");

describe("MerchantDate (component)", () => {
  it("renders the trigger label inside a kind-scoped data-test-id", () => {
    // Arrange
    const date = "2026-01-15T10:30:00Z";

    // Act
    renderInProviders(<MerchantDate kind="placed" date={date} now={now} />);

    // Assert
    // The data-test-id is parameterised by kind so multiple MerchantDates on
    // a page can be queried independently in E2E tests.
    const trigger = screen.getByTestId("merchant-date-placed");

    expect(trigger).toBeInTheDocument();
    expect(trigger.textContent).toMatch(/Placed/);
  });

  it("renders without crashing when no `now` is provided (live clock path)", () => {
    // Arrange & Act
    renderInProviders(<MerchantDate kind="placed" date={new Date().toISOString()} />);

    // Assert
    expect(screen.getByTestId("merchant-date-placed")).toBeInTheDocument();
  });
});
