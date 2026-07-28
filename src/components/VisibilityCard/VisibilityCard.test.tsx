import { ThemeProvider } from "@saleor/macaw-ui-next";
import { fireEvent, render, waitFor } from "@testing-library/react";
import type * as React from "react";
import { IntlProvider } from "react-intl";

import VisibilityCard from "./VisibilityCard";

// Freeze "now" so future/past publication dates are deterministic.
const NOW = Date.parse("2020-01-01T00:00:00Z");

jest.mock("@dashboard/hooks/useCurrentDate", () => ({
  useCurrentDate: () => NOW,
}));

const Wrapper = ({ children }: React.PropsWithChildren<{}>) => (
  <ThemeProvider>
    <IntlProvider locale="en">{children}</IntlProvider>
  </ThemeProvider>
);

const messages = {
  visibleLabel: "Visible",
  hiddenLabel: "Hidden",
  hiddenSecondLabel: "will be visible from date",
  setAvailabilityDateLabel: "Set availability date",
};

const renderCard = (data: { isPublished: boolean; publishedAt: string }, onChange = jest.fn()) => {
  const utils = render(
    <Wrapper>
      <VisibilityCard data={data} errors={[]} messages={messages} onChange={onChange} />
    </Wrapper>,
  );

  return { ...utils, onChange };
};

describe("VisibilityCard", () => {
  it("presents a page scheduled for future publication as hidden with the date field shown", () => {
    // Arrange & Act
    const { getByTestId, getByRole } = renderCard({
      isPublished: true,
      publishedAt: "2099-01-01T00:00:00Z",
    });

    // Assert - despite isPublished=true, a future date means the page is not yet
    // visible, so it is shown under "Hidden" with the editable schedule date.
    expect(getByRole("radio", { name: /Hidden/ })).toBeChecked();
    expect(getByRole("radio", { name: /Visible/ })).not.toBeChecked();
    expect(getByTestId("date-time-field")).toBeInTheDocument();
  });

  it("sets isPublished=true when a publication date is entered", async () => {
    // Arrange - a hidden page that already has the schedule checkbox revealed
    const { getByTestId, onChange } = renderCard({
      isPublished: false,
      publishedAt: "2099-01-01T00:00:00Z",
    });

    // Act
    fireEvent.change(getByTestId("date-time-field"), {
      target: { value: "2099-06-15T10:00" },
    });

    // Assert
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith({
        target: { name: "isPublished", value: true },
      });
    });
  });
});
