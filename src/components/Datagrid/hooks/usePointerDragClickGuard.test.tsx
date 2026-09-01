import { fireEvent, render } from "@testing-library/react";
import { type MouseEventHandler, type PointerEventHandler, type ReactElement } from "react";

import { usePointerDragClickGuard } from "./usePointerDragClickGuard";

interface GuardHarnessProps {
  onCellClick?: jest.Mock;
  onClick: jest.Mock;
  onDrag: jest.Mock;
}

const GuardHarness = ({ onCellClick, onClick, onDrag }: GuardHarnessProps): ReactElement => {
  const {
    onClickCapture,
    onPointerCancelCapture,
    onPointerDownCapture,
    onPointerMoveCapture,
    onPointerUpCapture,
    shouldSuppressClick,
  } = usePointerDragClickGuard(onDrag);
  const handleClick: MouseEventHandler<HTMLDivElement> = () => onClick();
  const handlePointerUp: PointerEventHandler<HTMLDivElement> = () => {
    if (onCellClick && !shouldSuppressClick()) {
      onCellClick();
    }
  };

  return (
    <div
      data-test-id="drag-target"
      onClick={handleClick}
      onClickCapture={onClickCapture}
      onPointerCancelCapture={onPointerCancelCapture}
      onPointerDownCapture={onPointerDownCapture}
      onPointerMoveCapture={onPointerMoveCapture}
      onPointerUp={handlePointerUp}
      onPointerUpCapture={onPointerUpCapture}
    />
  );
};

const dispatchPointerEvent = (
  target: Element,
  type: "pointercancel" | "pointerdown" | "pointermove" | "pointerup",
  {
    pointerId,
    clientX = 0,
    clientY = 0,
  }: { pointerId: number; clientX?: number; clientY?: number },
): void => {
  const event = new Event(type, { bubbles: true, cancelable: true });

  Object.defineProperties(event, {
    clientX: { value: clientX },
    clientY: { value: clientY },
    isPrimary: { value: true },
    pointerId: { value: pointerId },
  });
  fireEvent(target, event);
};

describe("usePointerDragClickGuard", () => {
  it("allows a tap to click", () => {
    // Arrange
    const onClick = jest.fn();
    const target = render(<GuardHarness onClick={onClick} onDrag={jest.fn()} />).getByTestId(
      "drag-target",
    );

    // Act
    dispatchPointerEvent(target, "pointerdown", { pointerId: 1, clientX: 20, clientY: 30 });
    dispatchPointerEvent(target, "pointerup", { pointerId: 1, clientX: 20, clientY: 30 });
    fireEvent.click(target);

    // Assert
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("suppresses the click generated after dragging", () => {
    // Arrange
    const onClick = jest.fn();
    const onDrag = jest.fn();
    const target = render(<GuardHarness onClick={onClick} onDrag={onDrag} />).getByTestId(
      "drag-target",
    );

    // Act
    dispatchPointerEvent(target, "pointerdown", { pointerId: 1, clientX: 20, clientY: 30 });
    dispatchPointerEvent(target, "pointermove", { pointerId: 1, clientX: 20, clientY: 37 });
    dispatchPointerEvent(target, "pointerup", { pointerId: 1, clientX: 20, clientY: 37 });
    fireEvent.click(target);

    // Assert
    expect(onDrag).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("suppresses Glide cell activation on pointerup after dragging", () => {
    // Arrange
    const onCellClick = jest.fn();
    const target = render(
      <GuardHarness onCellClick={onCellClick} onClick={jest.fn()} onDrag={jest.fn()} />,
    ).getByTestId("drag-target");

    // Act
    dispatchPointerEvent(target, "pointerdown", { pointerId: 1, clientX: 20, clientY: 30 });
    dispatchPointerEvent(target, "pointermove", { pointerId: 1, clientX: 27, clientY: 30 });
    dispatchPointerEvent(target, "pointerup", { pointerId: 1, clientX: 27, clientY: 30 });

    // Assert
    expect(onCellClick).not.toHaveBeenCalled();
  });

  it("treats a cancelled pointer gesture as scrolling", () => {
    // Arrange
    const onClick = jest.fn();
    const onDrag = jest.fn();
    const target = render(<GuardHarness onClick={onClick} onDrag={onDrag} />).getByTestId(
      "drag-target",
    );

    // Act
    dispatchPointerEvent(target, "pointerdown", { pointerId: 1, clientX: 20, clientY: 30 });
    dispatchPointerEvent(target, "pointercancel", { pointerId: 1 });
    fireEvent.click(target);

    // Assert
    expect(onDrag).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("suppresses both Glide cell activation and the following native click", () => {
    // Arrange
    const onCellClick = jest.fn();
    const onClick = jest.fn();
    const target = render(
      <GuardHarness onCellClick={onCellClick} onClick={onClick} onDrag={jest.fn()} />,
    ).getByTestId("drag-target");

    // Act
    dispatchPointerEvent(target, "pointerdown", { pointerId: 1, clientX: 20, clientY: 30 });
    dispatchPointerEvent(target, "pointermove", { pointerId: 1, clientX: 20, clientY: 37 });
    dispatchPointerEvent(target, "pointerup", { pointerId: 1, clientX: 20, clientY: 37 });
    fireEvent.click(target);

    // Assert
    expect(onCellClick).not.toHaveBeenCalled();
    expect(onClick).not.toHaveBeenCalled();
  });

  it("allows a tap after a completed drag gesture", () => {
    // Arrange
    const onClick = jest.fn();
    const target = render(<GuardHarness onClick={onClick} onDrag={jest.fn()} />).getByTestId(
      "drag-target",
    );

    // Act
    dispatchPointerEvent(target, "pointerdown", { pointerId: 1, clientX: 20, clientY: 30 });
    dispatchPointerEvent(target, "pointermove", { pointerId: 1, clientX: 20, clientY: 37 });
    dispatchPointerEvent(target, "pointerup", { pointerId: 1, clientX: 20, clientY: 37 });
    fireEvent.click(target);
    dispatchPointerEvent(target, "pointerdown", { pointerId: 2, clientX: 20, clientY: 30 });
    dispatchPointerEvent(target, "pointerup", { pointerId: 2, clientX: 20, clientY: 30 });
    fireEvent.click(target);

    // Assert
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
