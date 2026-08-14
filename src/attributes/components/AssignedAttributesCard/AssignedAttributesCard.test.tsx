import { attributeUrl } from "@dashboard/attributes/urls";
import { AttributeInputTypeEnum } from "@dashboard/graphql";
import Wrapper from "@test/wrapper";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory, type MemoryHistory } from "history";
import { Router } from "react-router-dom";

import { AssignedAttributesBulkDeleteButton } from "./AssignedAttributesBulkDeleteButton";
import { type AssignedAttributeListItem, AssignedAttributesCard } from "./AssignedAttributesCard";

// Radix mounts a hidden input inside <form>; jsdom has no ResizeObserver.
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

const attributeId = "QXR0cmlidXRlOjE=";
const listPath = "/model-types/1";

const attributes: AssignedAttributeListItem[] = [
  {
    id: attributeId,
    name: "Author",
    slug: "author",
    inputType: AttributeInputTypeEnum.DROPDOWN,
    valueRequired: true,
  },
];

const renderCard = (
  toggle: jest.Mock = jest.fn(),
): { history: MemoryHistory; toggle: jest.Mock } => {
  const history = createMemoryHistory({ initialEntries: [listPath] });

  render(
    <Router history={history}>
      <form>
        <AssignedAttributesCard
          attributes={attributes}
          disabled={false}
          title="Attributes"
          intro="Assigned attributes"
          empty="No attributes"
          cardTestId="page-attributes"
          assignTestId="assign-attributes"
          createTestId="create-attribute"
          createOptionLabel="Create attribute"
          skeletonTestId="page-attributes-skeleton"
          isChecked={() => false}
          selected={0}
          toggle={toggle}
          toggleAll={jest.fn()}
          toolbar={null}
          onAttributeAssign={jest.fn()}
          onAttributeCreate={jest.fn()}
          onAttributeReorder={jest.fn()}
          onAttributeUnassign={jest.fn()}
        />
      </form>
    </Router>,
    { wrapper: Wrapper },
  );

  return { history, toggle };
};

describe("AssignedAttributesCard selection header", () => {
  it("keeps value-required and unassign in their columns when rows are selected", () => {
    // Arrange
    const history = createMemoryHistory({ initialEntries: [listPath] });

    render(
      <Router history={history}>
        <AssignedAttributesCard
          attributes={attributes}
          disabled={false}
          title="Attributes"
          intro="Assigned attributes"
          empty="No attributes"
          cardTestId="page-attributes"
          assignTestId="assign-attributes"
          createTestId="create-attribute"
          createOptionLabel="Create attribute"
          skeletonTestId="page-attributes-skeleton"
          isChecked={() => true}
          selected={1}
          toggle={jest.fn()}
          toggleAll={jest.fn()}
          toolbar={<AssignedAttributesBulkDeleteButton onClick={jest.fn()} label="Unassign" />}
          onAttributeAssign={jest.fn()}
          onAttributeCreate={jest.fn()}
          onAttributeReorder={jest.fn()}
          onAttributeUnassign={jest.fn()}
        />
      </Router>,
      { wrapper: Wrapper },
    );

    // Assert
    const headerRow = screen.getByTestId("SelectedText").closest("tr");
    const bodyRow = screen.getByText("Author").closest("tr");

    if (!headerRow || !bodyRow) {
      throw new Error("Expected header and body rows");
    }

    // Assert
    expect(screen.getByTestId("SelectedText")).toHaveTextContent("Selected 1 item");
    expect(screen.getByText("Value required")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Unassign" })).toBeInTheDocument();
    expect(screen.getByTestId("bulk-delete-button")).toBeInTheDocument();
    expect(headerRow.querySelectorAll("th")).toHaveLength(bodyRow.querySelectorAll("td").length);
    expect(headerRow.querySelectorAll("th")[0]).toHaveAttribute(
      "data-test-id",
      "drag-column-spacer",
    );
    expect(
      within(headerRow.querySelectorAll("th")[1] as HTMLElement).getByTestId("select-all-checkbox"),
    ).toBeInTheDocument();
  });
});

describe("AssignedAttributesCard name link", () => {
  it("navigates to the attribute from the name, not the row", async () => {
    // Arrange
    const user = userEvent.setup();
    const { history } = renderCard();

    // Act
    await user.click(screen.getByText("Author"));

    // Assert
    expect(history.location.pathname).toBe(attributeUrl(attributeId).split("?")[0]);
  });
});

describe("AssignedAttributesCard row checkbox", () => {
  it("toggles without navigating to the attribute", async () => {
    // Arrange
    const user = userEvent.setup();
    const { history, toggle } = renderCard();
    const row = screen.getByText("Author").closest("tr");

    if (!row) {
      throw new Error("Expected a table row for the Author attribute");
    }

    // Act
    await user.click(within(row).getByRole("checkbox"));

    // Assert
    expect(toggle).toHaveBeenCalledWith(attributeId);
    expect(history.location.pathname).toBe(listPath);
  });
});
