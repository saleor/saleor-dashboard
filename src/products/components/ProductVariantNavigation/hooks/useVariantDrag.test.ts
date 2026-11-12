import type * as dndKit from "@dnd-kit/core";
import { act, renderHook } from "@testing-library/react";

import { type ProductVariantItem } from "../types";
import { useVariantDrag, type VariantReorderMove } from "./useVariantDrag";

jest.mock("@dnd-kit/core", () => ({
  ...jest.requireActual<typeof dndKit>("@dnd-kit/core"),
  useSensors: jest.fn(() => []),
  useSensor: jest.fn(),
}));

const variant = (id: string): ProductVariantItem => ({
  __typename: "ProductVariant",
  id,
  name: `Variant ${id}`,
  sku: `SKU-${id}`,
  media: [],
});

const variants: ProductVariantItem[] = [variant("1"), variant("2"), variant("3")];

/** A save whose answer the test gives when it chooses to. */
interface PendingSave {
  move: VariantReorderMove;
  succeed: () => void;
  fail: () => void;
}

const setup = (initialVariants: ProductVariantItem[] = variants) => {
  const saves: PendingSave[] = [];
  const onSaved = jest.fn<void, [string[]]>();
  const onFailed = jest.fn<void, []>();
  const onReorder = (move: VariantReorderMove): Promise<void> =>
    new Promise<void>((resolve, reject) => {
      saves.push({ move, succeed: resolve, fail: () => reject(new Error("not saved")) });
    });
  const hook = renderHook(
    ({ list }: { list: ProductVariantItem[] }) =>
      useVariantDrag({ variants: list, onReorder, onSaved, onFailed }),
    { initialProps: { list: initialVariants } },
  );
  const order = (): string[] => hook.result.current.orderedVariants.map(item => item.id);
  const drop = async (id: string, overId: string | null): Promise<void> => {
    await act(async () => {
      hook.result.current.handleDragEnd({
        active: { id },
        over: overId === null ? null : { id: overId },
      } as dndKit.DragEndEvent);
    });
  };
  /** Gives the API's answer and lets everything waiting on it run. */
  const answer = async (respond: () => void): Promise<void> => {
    await act(async () => {
      respond();
      await new Promise(resolve => setTimeout(resolve, 0));
    });
  };

  return { hook, saves, onSaved, onFailed, order, drop, answer };
};

describe("useVariantDrag", () => {
  it("keeps a dropped variant in its new place while the move is being saved", async () => {
    // Arrange
    const { saves, order, drop } = setup();

    // Act: "1" is dropped onto "2"
    await drop("1", "2");

    // Assert
    expect(order()).toEqual(["2", "1", "3"]);
    expect(saves.map(save => save.move)).toEqual([{ id: "1", sortOrder: 1 }]);
  });

  it("hands over the saved order once the move is saved", async () => {
    // Arrange
    const { saves, onSaved, onFailed, drop, answer } = setup();

    await drop("1", "2");

    // Act
    await answer(saves[0].succeed);

    // Assert
    expect(onSaved.mock.calls).toEqual([[["2", "1", "3"]]]);
    expect(onFailed).not.toHaveBeenCalled();
  });

  it("puts the variant back when its move is not saved", async () => {
    // Arrange
    const { saves, onSaved, onFailed, order, drop, answer } = setup();

    await drop("1", "2");

    // Act
    await answer(saves[0].fail);

    // Assert: back in place, and the caller is told so it can ask the API for its order
    expect(order()).toEqual(["1", "2", "3"]);
    expect(onSaved).not.toHaveBeenCalled();
    expect(onFailed).toHaveBeenCalledTimes(1);
  });

  it("saves moves made in quick succession one after another, each from the order before it", async () => {
    // Arrange
    const { saves, onSaved, order, drop, answer } = setup();

    // Act: a second drop while the first is still being saved
    await drop("1", "2");
    await drop("3", "2");

    // Assert: shown at once, but only the first is sent
    expect(order()).toEqual(["3", "2", "1"]);
    expect(saves.map(save => save.move)).toEqual([{ id: "1", sortOrder: 1 }]);

    // Act
    await answer(saves[0].succeed);

    // Assert: "3" moves two places up from where the first move left it
    expect(saves.map(save => save.move)).toEqual([
      { id: "1", sortOrder: 1 },
      { id: "3", sortOrder: -2 },
    ]);
    expect(onSaved).not.toHaveBeenCalled();

    // Act
    await answer(saves[1].succeed);

    // Assert
    expect(onSaved.mock.calls).toEqual([[["3", "2", "1"]]]);
  });

  it("does not send a move made on top of one that was not saved", async () => {
    // Arrange
    const { saves, onSaved, order, drop, answer } = setup();

    await drop("1", "2");
    await drop("3", "2");

    // Act
    await answer(saves[0].fail);

    // Assert
    expect(saves).toHaveLength(1);
    expect(order()).toEqual(["1", "2", "3"]);
    expect(onSaved).not.toHaveBeenCalled();
  });

  it("keeps the moves saved before one that fails", async () => {
    // Arrange
    const { saves, onSaved, onFailed, drop, answer } = setup();

    await drop("1", "2");
    await drop("3", "2");
    await answer(saves[0].succeed);

    // Act
    await answer(saves[1].fail);

    // Assert: only the first move's order is handed over, and the failure is reported once
    expect(onSaved.mock.calls).toEqual([[["2", "1", "3"]]]);
    expect(onFailed).toHaveBeenCalledTimes(1);
  });

  it("lists variants loaded while a move is being saved after the ones already there", async () => {
    // Arrange
    const { hook, order, drop } = setup();

    await drop("1", "2");

    // Act: the next page arrives
    hook.rerender({ list: [...variants, variant("4")] });

    // Assert
    expect(order()).toEqual(["2", "1", "3", "4"]);
  });

  it("changes nothing when a variant is dropped outside the list or back where it was", async () => {
    // Arrange
    const { saves, order, drop } = setup();

    // Act
    await drop("1", null);
    await drop("1", "1");

    // Assert
    expect(order()).toEqual(["1", "2", "3"]);
    expect(saves).toHaveLength(0);
  });

  it("tracks which variant is being dragged", async () => {
    // Arrange
    const { hook, drop } = setup();

    // Act
    await act(async () => {
      hook.result.current.handleDragStart({ active: { id: "2" } } as dndKit.DragStartEvent);
    });

    // Assert
    expect(hook.result.current.activeId).toBe("2");

    // Act
    await drop("2", "3");

    // Assert
    expect(hook.result.current.activeId).toBeNull();
  });
});
