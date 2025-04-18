import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { useForm } from "react-hook-form";

import { useAutoSubmit } from "./auto-submit";

interface TestFormData {
  testField: string;
}

const DEBOUNCE_TIME = 1000;

// Test component for testing useAutoSubmit in useForm from react-hook-form
const TestFormComponent = ({ onSubmit }: { onSubmit: () => void }) => {
  const { control, watch, handleSubmit } = useForm<TestFormData>({
    defaultValues: {
      testField: "",
    },
  });

  useAutoSubmit({
    control,
    watch,
    onSubmit,
    debounceTime: DEBOUNCE_TIME,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} aria-label="test form">
      <input {...control.register("testField")} />
    </form>
  );
};

describe("useAutoSubmit", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("should not call onSubmit immediately after input change", async () => {
    // Arrange
    const mockSubmit = jest.fn();
    const user = userEvent.setup({ delay: null });

    render(<TestFormComponent onSubmit={mockSubmit} />);

    const input = screen.getByRole("textbox");

    // Act
    await act(async () => {
      await user.type(input, "hello");
      jest.advanceTimersByTime(0);
    });

    // Assert
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it("should call onSubmit after debounce time has passed", async () => {
    // Arrange
    const mockSubmit = jest.fn();
    const user = userEvent.setup({ delay: null });

    render(<TestFormComponent onSubmit={mockSubmit} />);

    const input = screen.getByRole("textbox");

    // Act
    await act(async () => {
      await user.type(input, "hello");
      jest.advanceTimersByTime(DEBOUNCE_TIME);
    });

    // Assert
    expect(mockSubmit).toHaveBeenCalledTimes(1);
  });

  it("should reset debounce timer on subsequent input changes", async () => {
    // Arrange
    const mockSubmit = jest.fn();
    const user = userEvent.setup({ delay: null });

    render(<TestFormComponent onSubmit={mockSubmit} />);

    const input = screen.getByRole("textbox");

    // Act
    await act(async () => {
      await user.type(input, "a");
      jest.advanceTimersByTime(DEBOUNCE_TIME - 100);
      await user.type(input, "b");
      jest.advanceTimersByTime(DEBOUNCE_TIME);
    });

    // Assert
    expect(mockSubmit).toHaveBeenCalledTimes(1);
  });

  it("should not submit if component unmounts before debounce timeout", async () => {
    // Arrange
    const mockSubmit = jest.fn();
    const user = userEvent.setup({ delay: null });
    const { unmount } = render(<TestFormComponent onSubmit={mockSubmit} />);
    const input = screen.getByRole("textbox");

    // Act
    await act(async () => {
      await user.type(input, "hello");
    });

    unmount();

    act(() => {
      jest.advanceTimersByTime(DEBOUNCE_TIME);
    });

    // Assert
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it("should cancel debounced submit when form is manually submitted", async () => {
    // Arrange
    const mockSubmit = jest.fn();
    const user = userEvent.setup({ delay: null });

    render(<TestFormComponent onSubmit={mockSubmit} />);

    const input = screen.getByRole("textbox");
    const form = screen.getByRole("form", { name: "test form" });

    // Act
    await act(async () => {
      await user.type(input, "hello");
      // Submit form manually before debounce time passes
      fireEvent.submit(form);
      // Advance timers to when debounced submit would have happened
      jest.advanceTimersByTime(DEBOUNCE_TIME);
    });

    // Assert
    expect(mockSubmit).toHaveBeenCalledTimes(1);
  });
});
