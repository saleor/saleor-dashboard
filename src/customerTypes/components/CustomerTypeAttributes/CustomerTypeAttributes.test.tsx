import { AttributeInputTypeEnum, AttributeTypeEnum } from "@dashboard/graphql";
import Wrapper from "@test/wrapper";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";

import { CustomerTypeAttributes } from "./CustomerTypeAttributes";

const attributes = [
  {
    __typename: "Attribute" as const,
    id: "attr-loyalty",
    name: "Loyalty level",
    slug: "loyalty-level",
    type: AttributeTypeEnum.CUSTOMER_TYPE,
    visibleInStorefront: true,
    filterableInStorefront: true,
    unit: null,
    inputType: AttributeInputTypeEnum.DROPDOWN,
    valueRequired: true,
  },
  {
    __typename: "Attribute" as const,
    id: "attr-company",
    name: "Company size",
    slug: "company-size",
    type: AttributeTypeEnum.CUSTOMER_TYPE,
    visibleInStorefront: true,
    filterableInStorefront: true,
    unit: null,
    inputType: AttributeInputTypeEnum.DROPDOWN,
    valueRequired: false,
  },
];

const listProps = {
  disabled: false,
  type: AttributeTypeEnum.CUSTOMER_TYPE,
  isChecked: () => false,
  selected: 0,
  toggle: () => undefined,
  toggleAll: () => undefined,
  toolbar: null,
  onAttributeAssign: () => undefined,
  onAttributeCreate: () => undefined,
  onAttributeReorder: () => undefined,
  onAttributeUnassign: () => undefined,
};

describe("CustomerTypeAttributes loading", () => {
  it("keeps table headings while attribute rows are loading", () => {
    // Arrange & Act
    render(<CustomerTypeAttributes {...listProps} attributes={undefined} disabled />, {
      wrapper: Wrapper,
    });

    // Assert
    expect(screen.getByText("Attribute name")).toBeInTheDocument();
    expect(screen.getByText("Value required")).toBeInTheDocument();
    expect(screen.getByTestId("customer-attributes-skeleton")).toBeInTheDocument();
  });
});

describe("CustomerTypeAttributes value required column", () => {
  it("shows Required and Optional from the assigned attributes", () => {
    // Arrange & Act
    const history = createMemoryHistory({ initialEntries: ["/customer-types/1"] });

    render(
      <Router history={history}>
        <CustomerTypeAttributes attributes={attributes} {...listProps} />
      </Router>,
      { wrapper: Wrapper },
    );

    // Assert
    const loyaltyRow = screen.getByText("Loyalty level").closest("tr");
    const companyRow = screen.getByText("Company size").closest("tr");

    if (!loyaltyRow || !companyRow) {
      throw new Error("Expected Loyalty level and Company size rows");
    }

    expect(within(loyaltyRow).getByTestId("value-required")).toHaveTextContent("Required");
    expect(within(companyRow).getByTestId("value-required")).toHaveTextContent("Optional");
  });
});

describe("CustomerTypeAttributes row checkbox", () => {
  it("toggles without navigating to the attribute", async () => {
    // Arrange
    const user = userEvent.setup();
    const history = createMemoryHistory({ initialEntries: ["/customer-types/1"] });
    const toggle = jest.fn();

    render(
      <Router history={history}>
        <CustomerTypeAttributes attributes={attributes} {...listProps} toggle={toggle} />
      </Router>,
      { wrapper: Wrapper },
    );

    const row = screen.getByText("Loyalty level").closest("tr");

    if (!row) {
      throw new Error("Expected a table row for the Loyalty level attribute");
    }

    // Act
    await user.click(within(row).getByRole("checkbox"));

    // Assert
    expect(toggle).toHaveBeenCalledWith("attr-loyalty");
    expect(history.location.pathname).toBe("/customer-types/1");
  });
});
