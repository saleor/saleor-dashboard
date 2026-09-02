import { FieldType, type FilterElement, type IFilter } from "@dashboard/components/Filter/types";
import Wrapper from "@test/wrapper";
import { fireEvent, render, screen, within } from "@testing-library/react";

import { FilterContent } from "./FilterContent";

const nameFilter: FilterElement = {
  active: false,
  label: "Name",
  multiple: false,
  name: "name",
  type: FieldType.text,
  value: [],
};
const statusFilter: FilterElement = {
  active: false,
  label: "Status",
  multiple: false,
  name: "status",
  type: FieldType.text,
  value: [],
};
const dataStructure: IFilter = [nameFilter, statusFilter];

const clickAccordionTrigger = (filterName: string) =>
  fireEvent.click(
    within(screen.getByTestId(`channel-availability-item-${filterName}`)).getByRole("button"),
  );

const renderFilterContent = () =>
  render(
    <FilterContent
      dataStructure={dataStructure}
      filters={dataStructure}
      onClear={jest.fn()}
      onFilterPropertyChange={jest.fn()}
      onSubmit={jest.fn()}
    />,
    { wrapper: Wrapper },
  );

describe("FilterContent", () => {
  it("keeps every filter body collapsed initially", () => {
    // Arrange & Act
    renderFilterContent();

    // Assert
    expect(screen.queryByTestId("filter-field-name")).not.toBeInTheDocument();
    expect(screen.queryByTestId("filter-field-status")).not.toBeInTheDocument();
  });

  it("expands only the clicked filter and collapses it on second click", () => {
    // Arrange
    renderFilterContent();

    // Act
    clickAccordionTrigger("name");

    // Assert
    expect(screen.getByTestId("filter-field-name")).toBeInTheDocument();
    expect(screen.queryByTestId("filter-field-status")).not.toBeInTheDocument();

    // Act
    clickAccordionTrigger("name");

    // Assert
    expect(screen.queryByTestId("filter-field-name")).not.toBeInTheDocument();
  });
});
