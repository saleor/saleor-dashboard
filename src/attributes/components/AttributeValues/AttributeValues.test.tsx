import { attribute } from "@dashboard/attributes/fixtures";
import { AttributeInputTypeEnum } from "@dashboard/graphql";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

import { AttributeValues } from "./AttributeValues";

const values = mapEdgesToItems(attribute?.choices) ?? [];

const TestWrapper = ({ children }: { children: ReactNode }) => (
  <MemoryRouter>
    <Wrapper>{children}</Wrapper>
  </MemoryRouter>
);

const renderValues = ({
  onValueUpdate = jest.fn(),
  selected = 0,
  toggle = jest.fn(),
}: {
  onValueUpdate?: jest.Mock;
  selected?: number;
  toggle?: jest.Mock;
} = {}) => {
  render(
    <AttributeValues
      disabled={false}
      inputType={AttributeInputTypeEnum.DROPDOWN}
      isChecked={id => id === values[0]?.id && selected > 0}
      onNextPage={jest.fn()}
      onPreviousPage={jest.fn()}
      onValueAdd={jest.fn()}
      onValueDelete={jest.fn()}
      onValueReorder={jest.fn()}
      onValueUpdate={onValueUpdate}
      pageInfo={{ hasNextPage: false, hasPreviousPage: false }}
      selected={selected}
      toggle={toggle}
      toggleAll={jest.fn()}
      toolbar={<button type="button">Delete selected</button>}
      values={values}
    />,
    { wrapper: TestWrapper },
  );

  return { onValueUpdate, toggle };
};

describe("AttributeValues bulk selection", () => {
  it("renders a select-all checkbox in the values table", () => {
    // Arrange & Act
    renderValues();

    // Assert
    expect(screen.getByTestId("select-all-checkbox")).toBeInTheDocument();
  });

  it("toggles a row checkbox without opening the edit dialog", async () => {
    // Arrange
    const user = userEvent.setup();
    const { onValueUpdate, toggle } = renderValues();
    const checkboxes = screen.getAllByRole("checkbox");
    const rowCheckbox = checkboxes[1];

    // Act
    await user.click(rowCheckbox);

    // Assert
    expect(toggle).toHaveBeenCalledWith(values[0].id);
    expect(onValueUpdate).not.toHaveBeenCalled();
  });

  it("shows bulk delete in the table heading, not the card header", () => {
    // Arrange & Act
    renderValues({ selected: 2 });

    // Assert
    expect(screen.getByText("Selected 2 items")).toBeInTheDocument();
    expect(screen.getByText("Delete selected")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Assign value" })).toBeInTheDocument();
    expect(screen.queryByText("Default Store View")).not.toBeInTheDocument();
  });

  it("uses compact collection-style pagination", () => {
    // Arrange & Act
    render(
      <AttributeValues
        disabled={false}
        inputType={AttributeInputTypeEnum.DROPDOWN}
        isChecked={() => false}
        onNextPage={jest.fn()}
        onPreviousPage={jest.fn()}
        onUpdateListSettings={jest.fn()}
        onValueAdd={jest.fn()}
        onValueDelete={jest.fn()}
        onValueReorder={jest.fn()}
        onValueUpdate={jest.fn()}
        pageInfo={{ hasNextPage: true, hasPreviousPage: false }}
        selected={0}
        settings={{ rowNumber: 10 }}
        toggle={jest.fn()}
        toggleAll={jest.fn()}
        toolbar={null}
        values={values}
      />,
      { wrapper: TestWrapper },
    );

    // Assert
    expect(screen.getByText("No. of rows")).toBeInTheDocument();
    expect(screen.getByTestId("button-pagination-back")).toBeInTheDocument();
    expect(screen.getByTestId("button-pagination-next")).toBeInTheDocument();
  });
});

describe("AttributeValues create modal", () => {
  it("keeps the inline add field inside the values table well", () => {
    // Arrange & Act
    render(
      <AttributeValues
        addMode="inline"
        attributeName="Brand"
        disabled={false}
        inputType={AttributeInputTypeEnum.DROPDOWN}
        isChecked={() => false}
        onInlineValueAdd={jest.fn()}
        onNextPage={jest.fn()}
        onPreviousPage={jest.fn()}
        onValueAdd={jest.fn()}
        onValueDelete={jest.fn()}
        onValueReorder={jest.fn()}
        onValueUpdate={jest.fn()}
        pageInfo={{ hasNextPage: false, hasPreviousPage: false }}
        selected={0}
        toggle={jest.fn()}
        toggleAll={jest.fn()}
        toolbar={null}
        values={[]}
        variant="embedded"
      />,
      { wrapper: TestWrapper },
    );

    // Assert — the add field lives in the table so ResponsiveTable's bordered well wraps it
    expect(screen.getByTestId("attribute-value-inline-add").closest("table")).toBeInTheDocument();
  });
});
