import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";

import { CreateWarehouseDialog } from "./CreateWarehouseDialog";

const renderDialog = (channelName?: string): ReturnType<typeof render> =>
  render(
    <Wrapper>
      <CreateWarehouseDialog
        open
        channelName={channelName}
        confirmButtonState="default"
        countries={[{ code: "PL", country: "Poland", __typename: "CountryDisplay" }]}
        defaultCountryCode="PL"
        errors={[]}
        onClose={jest.fn()}
        onSubmit={jest.fn()}
      />
    </Wrapper>,
  );

describe("CreateWarehouseDialog", () => {
  it("says the warehouse can be added to a channel on the next page", () => {
    // Arrange
    renderDialog();

    // Assert
    expect(
      screen.getByText("Add it to a channel on the next page so its stock can be sold."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create" })).toBeInTheDocument();
  });

  it("does not submit until the location has a country", () => {
    // Arrange
    render(
      <Wrapper>
        <CreateWarehouseDialog
          open
          confirmButtonState="default"
          countries={[{ code: "PL", country: "Poland", __typename: "CountryDisplay" }]}
          defaultCountryCode=""
          errors={[]}
          onClose={jest.fn()}
          onSubmit={jest.fn()}
        />
      </Wrapper>,
    );

    // Assert
    expect(screen.getByTestId("submit")).toBeDisabled();
  });

  it("says the warehouse will be assigned when it is created for a channel", () => {
    // Arrange
    renderDialog("Europe");

    // Assert
    expect(
      screen.getByText("Creates a warehouse and assigns it to this channel as the stock location."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create and assign" })).toBeInTheDocument();
  });
});
