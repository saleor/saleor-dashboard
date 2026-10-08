import {
  type CountryFragment,
  WarehouseErrorCode,
  type WarehouseErrorFragment,
} from "@dashboard/graphql";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type ComponentProps } from "react";

import { CreateWarehouseDialog } from "./CreateWarehouseDialog";

type CreateWarehouseDialogProps = ComponentProps<typeof CreateWarehouseDialog>;

const countries: CountryFragment[] = [
  { code: "PL", country: "Poland", __typename: "CountryDisplay" },
];

const renderDialog = (props: Partial<CreateWarehouseDialogProps> = {}): ReturnType<typeof render> =>
  render(
    <Wrapper>
      <CreateWarehouseDialog
        open
        confirmButtonState="default"
        countries={countries}
        defaultCountryCode="PL"
        errors={[]}
        onClose={jest.fn()}
        onSubmit={jest.fn()}
        {...props}
      />
    </Wrapper>,
  );

describe("CreateWarehouseDialog", () => {
  it("says the warehouse can be added to a channel on the next page", () => {
    // Arrange
    const props: Partial<CreateWarehouseDialogProps> = { channelName: undefined };

    // Act
    renderDialog(props);

    // Assert
    expect(
      screen.getByText("Add it to a channel on the next page so its stock can be sold."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create" })).toBeInTheDocument();
  });

  it("shows a create failure in the dialog", async () => {
    // Arrange
    const createErrors: WarehouseErrorFragment[] = [
      {
        __typename: "WarehouseError",
        code: WarehouseErrorCode.INVALID,
        field: null,
        message: "Could not create the warehouse.",
      },
    ];

    renderDialog({ onSubmit: async () => createErrors });

    // Act
    await userEvent.type(screen.getByTestId("warehouse-name-input"), "Europe");
    await userEvent.click(screen.getByTestId("submit"));

    // Assert
    expect(await screen.findByTestId("create-warehouse-form-error")).toHaveTextContent(
      "Could not create the warehouse.",
    );
  });

  it("does not submit until the location has a country", () => {
    // Arrange
    const props: Partial<CreateWarehouseDialogProps> = { defaultCountryCode: "" };

    // Act
    renderDialog(props);

    // Assert
    expect(screen.getByTestId("submit")).toBeDisabled();
  });

  it("says the warehouse will be assigned when it is created for a channel", () => {
    // Arrange
    const props: Partial<CreateWarehouseDialogProps> = { channelName: "Europe" };

    // Act
    renderDialog(props);

    // Assert
    expect(
      screen.getByText("Creates a warehouse and assigns it to this channel as the stock location."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create and assign" })).toBeInTheDocument();
  });
});
