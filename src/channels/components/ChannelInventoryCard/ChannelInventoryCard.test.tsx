import { type ChannelWarehouses } from "@dashboard/channels/pages/ChannelDetailsPage/types";
import { AllocationStrategyEnum } from "@dashboard/graphql";
import { type DragEndEvent } from "@dnd-kit/core";
import { render, type RenderResult } from "@testing-library/react";
import { type ReactNode } from "react";
import { IntlProvider } from "react-intl";

import { ChannelInventoryCard } from "./ChannelInventoryCard";

let onDragEnd: ((event: DragEndEvent) => void) | undefined;

jest.mock("@dnd-kit/core", () => {
  const actual: typeof import("@dnd-kit/core") = jest.requireActual("@dnd-kit/core");

  return {
    ...actual,
    // Swap the provider for a pass-through so the test can fire drag end directly.
    DndContext: (props: {
      children: ReactNode;
      onDragEnd: (event: DragEndEvent) => void;
    }): ReactNode => {
      onDragEnd = props.onDragEnd;

      return props.children;
    },
  };
});

const warehouses: ChannelWarehouses = [
  { __typename: "Warehouse", id: "w1", name: "Barcelona" },
  { __typename: "Warehouse", id: "w2", name: "Lisbon" },
  { __typename: "Warehouse", id: "w3", name: "Madrid" },
];

const renderCard = (reorderWarehouses: jest.Mock): RenderResult =>
  render(
    <IntlProvider locale="en">
      <ChannelInventoryCard
        warehouses={warehouses}
        removeWarehouse={jest.fn()}
        reorderWarehouses={reorderWarehouses}
        disabled={false}
        availableWarehousesCount={5}
        canCreateWarehouse
        onAllocationStrategyChange={jest.fn()}
        allocationStrategy={AllocationStrategyEnum.PRIORITIZE_SORTING_ORDER}
      />
    </IntlProvider>,
  );

describe("ChannelInventoryCard", () => {
  it("translates a drop onto another warehouse into old/new indexes", () => {
    // Arrange
    const reorderWarehouses = jest.fn();

    renderCard(reorderWarehouses);

    // Act
    onDragEnd?.({ active: { id: "w3" }, over: { id: "w1" } } as DragEndEvent);

    // Assert
    expect(reorderWarehouses).toHaveBeenCalledWith({ oldIndex: 2, newIndex: 0 });
  });

  it("ignores a drop outside the list or onto itself", () => {
    // Arrange
    const reorderWarehouses = jest.fn();

    renderCard(reorderWarehouses);

    // Act
    onDragEnd?.({ active: { id: "w2" }, over: null } as DragEndEvent);
    onDragEnd?.({ active: { id: "w2" }, over: { id: "w2" } } as DragEndEvent);

    // Assert
    expect(reorderWarehouses).not.toHaveBeenCalled();
  });

  it("exposes every drag handle to the keyboard", () => {
    // Arrange
    const { container } = renderCard(jest.fn());

    // Act
    const handles = container.querySelectorAll('[aria-roledescription="sortable"]');

    // Assert
    expect(handles).toHaveLength(warehouses.length);
    handles.forEach(handle => expect(handle).toHaveAttribute("tabindex", "0"));
  });
});
