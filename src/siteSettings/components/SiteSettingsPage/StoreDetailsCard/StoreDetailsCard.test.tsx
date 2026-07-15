import { ShopErrorCode, type ShopErrorFragment } from "@dashboard/graphql";
import { ThemeProvider } from "@saleor/macaw-ui-next";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";

import { StoreDetailsCard } from "./StoreDetailsCard";

jest.mock("react-intl", () => ({
  FormattedMessage: ({ defaultMessage }: { defaultMessage: string }) => <>{defaultMessage}</>,
  useIntl: () => ({
    formatMessage: ({ defaultMessage }: { defaultMessage: string }) => defaultMessage,
  }),
  defineMessages: (messages: Record<string, unknown>) => messages,
}));

const renderCard = (props: Partial<Parameters<typeof StoreDetailsCard>[0]> = {}) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <ThemeProvider>{children}</ThemeProvider>
  );

  return render(
    <StoreDetailsCard
      data={{ name: "My store", description: "Best shop around" }}
      errors={[]}
      disabled={false}
      onChange={jest.fn()}
      {...props}
    />,
    { wrapper },
  );
};

describe("StoreDetailsCard", () => {
  it("renders name and description values from data", () => {
    // Arrange & Act
    renderCard();

    // Assert
    expect(screen.getByDisplayValue("My store")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Best shop around")).toBeInTheDocument();
  });

  it("calls onChange when a field is edited", async () => {
    // Arrange
    const onChange = jest.fn();

    renderCard({ data: { name: "", description: "" }, onChange });

    // Act
    await userEvent.type(screen.getByTestId("store-name-input"), "A");

    // Assert
    expect(onChange).toHaveBeenCalled();
  });

  it("surfaces API errors for the fields", () => {
    // Arrange
    const errors: ShopErrorFragment[] = [
      {
        __typename: "ShopError",
        code: ShopErrorCode.REQUIRED,
        field: "name",
        message: "This field is required.",
      },
    ];

    // Act
    renderCard({ errors });

    // Assert
    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });
});
