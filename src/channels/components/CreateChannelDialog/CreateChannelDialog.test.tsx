import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CreateChannelDialog } from "./CreateChannelDialog";
import { useChannelSlugAvailability } from "./useChannelSlugAvailability";

// DynamicCombobox uses IntersectionObserver for infinite scroll.
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

jest.mock("./useChannelSlugAvailability", () => ({
  useChannelSlugAvailability: jest.fn(() => ({
    isChecking: false,
    isTaken: false,
  })),
}));

const mockedUseChannelSlugAvailability = useChannelSlugAvailability as jest.MockedFunction<
  typeof useChannelSlugAvailability
>;

const countries = [
  { code: "US", country: "United States", vat: null, __typename: "CountryDisplay" as const },
  { code: "DE", country: "Germany", vat: null, __typename: "CountryDisplay" as const },
];

describe("CreateChannelDialog", () => {
  beforeEach(() => {
    mockedUseChannelSlugAvailability.mockReturnValue({
      isChecking: false,
      isTaken: false,
    });
  });

  it("focuses the channel name field when opened", () => {
    // Arrange & Act
    render(
      <Wrapper>
        <CreateChannelDialog
          open
          confirmButtonState="default"
          countries={countries}
          errors={[]}
          onClose={jest.fn()}
          onSubmit={jest.fn(async () => [])}
        />
      </Wrapper>,
    );

    // Assert
    expect(screen.getByTestId("channel-name-input")).toHaveFocus();
  });

  it("renders basic fields and auto-fills slug from name", async () => {
    // Arrange
    const user = userEvent.setup();

    render(
      <Wrapper>
        <CreateChannelDialog
          open
          confirmButtonState="default"
          countries={countries}
          errors={[]}
          onClose={jest.fn()}
          onSubmit={jest.fn(async () => [])}
        />
      </Wrapper>,
    );

    // Act
    await user.type(screen.getByTestId("channel-name-input"), "Europe");

    // Assert
    expect(screen.getByTestId("create-channel-dialog")).toBeInTheDocument();
    expect(screen.getByTestId("slug-name-input")).toHaveValue("europe");
    expect(screen.getByTestId("country-select-input")).toBeInTheDocument();
    expect(screen.getByTestId("channel-currency-select-input")).toBeInTheDocument();
  });

  it("disables submit until required fields are filled", () => {
    // Arrange / Act
    render(
      <Wrapper>
        <CreateChannelDialog
          open
          confirmButtonState="default"
          countries={countries}
          errors={[]}
          onClose={jest.fn()}
          onSubmit={jest.fn(async () => [])}
        />
      </Wrapper>,
    );

    // Assert
    expect(screen.getByTestId("submit")).toBeDisabled();
  });

  it("shows a uniqueness error and disables submit when the slug is taken", () => {
    // Arrange
    mockedUseChannelSlugAvailability.mockReturnValue({
      isChecking: false,
      isTaken: true,
    });

    // Act
    render(
      <Wrapper>
        <CreateChannelDialog
          open
          confirmButtonState="default"
          countries={countries}
          errors={[]}
          onClose={jest.fn()}
          onSubmit={jest.fn(async () => [])}
        />
      </Wrapper>,
    );

    // Assert
    expect(screen.getByText("Slug must be unique")).toBeInTheDocument();
    expect(screen.getByTestId("submit")).toBeDisabled();
  });
});
