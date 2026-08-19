import { AttributeInputTypeEnum, AttributeTypeEnum } from "@dashboard/graphql";
import Wrapper from "@test/wrapper";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";

import PageTypeAttributes from "./PageTypeAttributes";

const attributes = [
  {
    __typename: "Attribute" as const,
    id: "attr-author",
    name: "Author",
    slug: "author",
    type: AttributeTypeEnum.PAGE_TYPE,
    visibleInStorefront: true,
    filterableInDashboard: true,
    filterableInStorefront: true,
    unit: null,
    inputType: AttributeInputTypeEnum.DROPDOWN,
    valueRequired: true,
  },
  {
    __typename: "Attribute" as const,
    id: "attr-language",
    name: "Language",
    slug: "language",
    type: AttributeTypeEnum.PAGE_TYPE,
    visibleInStorefront: true,
    filterableInDashboard: true,
    filterableInStorefront: true,
    unit: null,
    inputType: AttributeInputTypeEnum.DROPDOWN,
    valueRequired: false,
  },
];

const listProps = {
  disabled: false,
  type: AttributeTypeEnum.PAGE_TYPE,
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

describe("PageTypeAttributes loading", () => {
  it("keeps table headings while attribute rows are loading", () => {
    // Arrange & Act
    render(<PageTypeAttributes {...listProps} attributes={undefined} disabled />, {
      wrapper: Wrapper,
    });

    // Assert
    expect(screen.getByText("Attribute name")).toBeInTheDocument();
    expect(screen.getByText("Value required")).toBeInTheDocument();
    expect(screen.getByTestId("page-attributes-skeleton")).toBeInTheDocument();
  });
});

describe("PageTypeAttributes value required column", () => {
  it("shows Required and Optional from the assigned attributes", () => {
    // Arrange & Act
    const history = createMemoryHistory({ initialEntries: ["/model-types/1"] });

    render(
      <Router history={history}>
        <PageTypeAttributes attributes={attributes} {...listProps} />
      </Router>,
      { wrapper: Wrapper },
    );

    // Assert
    const authorRow = screen.getByText("Author").closest("tr");
    const languageRow = screen.getByText("Language").closest("tr");

    if (!authorRow || !languageRow) {
      throw new Error("Expected Author and Language rows");
    }

    expect(within(authorRow).getByTestId("value-required")).toHaveTextContent("Required");
    expect(within(languageRow).getByTestId("value-required")).toHaveTextContent("Optional");
  });
});

describe("PageTypeAttributes row checkbox", () => {
  it("toggles without navigating to the attribute", async () => {
    // Arrange
    const user = userEvent.setup();
    const history = createMemoryHistory({ initialEntries: ["/model-types/1"] });
    const toggle = jest.fn();

    render(
      <Router history={history}>
        <PageTypeAttributes attributes={attributes} {...listProps} toggle={toggle} />
      </Router>,
      { wrapper: Wrapper },
    );

    const row = screen.getByText("Author").closest("tr");

    if (!row) {
      throw new Error("Expected a table row for the Author attribute");
    }

    // Act
    await user.click(within(row).getByRole("checkbox"));

    // Assert
    expect(toggle).toHaveBeenCalledWith("attr-author");
    expect(history.location.pathname).toBe("/model-types/1");
  });
});
