import { act, renderHook } from "@testing-library/react";

import useForm from "./index";

interface VoucherSettings {
  name: string;
  minSpent: string;
}

// What the server stored; it doesn't change when a save keeps the same values
const saved: VoucherSettings = { name: "Summer sale", minSpent: "" };

const renderForm = () =>
  renderHook(
    ({ resetKey }: { resetKey: number }) =>
      useForm<VoucherSettings, never>({ ...saved }, undefined, { confirmLeave: false, resetKey }),
    { initialProps: { resetKey: 0 } },
  );

describe("useForm resetKey", () => {
  it("drops a draft the server didn't keep when the key changes", () => {
    // Arrange
    const { result, rerender } = renderForm();

    act(() => result.current.change({ target: { name: "minSpent", value: "0" } }));

    // Act
    rerender({ resetKey: 1 });

    // Assert
    expect(result.current.data).toEqual(saved);
    expect(result.current.changedData).toEqual({});
  });

  it("keeps the draft while the key stays the same", () => {
    // Arrange
    const { result, rerender } = renderForm();

    act(() => result.current.change({ target: { name: "minSpent", value: "0" } }));

    // Act
    rerender({ resetKey: 0 });

    // Assert
    expect(result.current.data).toEqual({ ...saved, minSpent: "0" });
    expect(result.current.changedData).toEqual({ minSpent: "0" });
  });
});
