import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ATTRIBUTE_DESCRIPTION_COLLAPSED_STORAGE_KEY } from "./attributeDescriptionCollapse";
import { BasicAttributeRow } from "./BasicAttributeRow";

jest.mock("react-intl", () => {
  const actual = jest.requireActual("react-intl");

  return {
    ...actual,
    useIntl: () => ({
      formatMessage: ({ defaultMessage }: { defaultMessage: string }) => defaultMessage,
    }),
  };
});

const renderRows = (rows: Array<{ attributeId: string; internalDescription: string | null }>) =>
  render(
    <ul>
      {rows.map(({ attributeId, internalDescription }) => (
        <BasicAttributeRow
          key={attributeId}
          id={`${attributeId}-input`}
          attributeId={attributeId}
          internalDescription={internalDescription}
          label={attributeId}
        >
          <input id={`${attributeId}-input`} />
        </BasicAttributeRow>
      ))}
    </ul>,
  );

const storedCollapsedIds = (): unknown =>
  JSON.parse(localStorage.getItem(ATTRIBUTE_DESCRIPTION_COLLAPSED_STORAGE_KEY) ?? "null");

describe("BasicAttributeRow internal description", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("shows the description expanded by default", () => {
    // Arrange & Act
    renderRows([{ attributeId: "weight", internalDescription: "Grams.\nWhole numbers." }]);

    // Assert
    expect(screen.getByTestId("attribute-description")).toHaveTextContent("Grams. Whole numbers.");
    expect(screen.getByRole("button", { name: "Hide description" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("renders no toggle when the description is empty or whitespace", () => {
    // Arrange & Act
    renderRows([
      { attributeId: "weight", internalDescription: null },
      { attributeId: "size", internalDescription: "  " },
    ]);

    // Assert
    expect(screen.queryByTestId("attribute-description-toggle")).not.toBeInTheDocument();
    expect(screen.queryByTestId("attribute-description")).not.toBeInTheDocument();
  });

  it("collapses the description and remembers it for the attribute", async () => {
    // Arrange
    const { unmount } = renderRows([{ attributeId: "weight", internalDescription: "Grams." }]);

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Hide description" }));

    // Assert
    expect(screen.queryByTestId("attribute-description")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Show description" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(storedCollapsedIds()).toEqual(["weight"]);

    unmount();
    renderRows([{ attributeId: "weight", internalDescription: "Grams." }]);
    expect(screen.queryByTestId("attribute-description")).not.toBeInTheDocument();
  });

  it("expands a collapsed description and removes it from storage", async () => {
    // Arrange
    localStorage.setItem(ATTRIBUTE_DESCRIPTION_COLLAPSED_STORAGE_KEY, JSON.stringify(["weight"]));
    renderRows([{ attributeId: "weight", internalDescription: "Grams." }]);

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Show description" }));

    // Assert
    expect(screen.getByTestId("attribute-description")).toHaveTextContent("Grams.");
    expect(storedCollapsedIds()).toEqual([]);
  });

  it("keeps every row's collapsed state when several rows are toggled", async () => {
    // Arrange
    renderRows([
      { attributeId: "weight", internalDescription: "Grams." },
      { attributeId: "size", internalDescription: "EU sizes." },
    ]);

    const [weightToggle, sizeToggle] = screen.getAllByRole("button", { name: "Hide description" });

    // Act
    await userEvent.click(weightToggle);
    await userEvent.click(sizeToggle);

    // Assert
    expect(storedCollapsedIds()).toEqual(["weight", "size"]);
  });

  it("keeps the toggle outside the label so clicking it never targets the value input", () => {
    // Arrange & Act
    renderRows([{ attributeId: "weight", internalDescription: "Grams." }]);

    // Assert
    expect(screen.getByTestId("attribute-label")).not.toContainElement(
      screen.getByTestId("attribute-description-toggle"),
    );
  });
});
