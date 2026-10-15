import { act, renderHook } from "@testing-library/react";
import { type PropsWithChildren } from "react";
import { IntlProvider } from "react-intl";

import { createBulkSubmitResult } from "../bulkSubmitResult";
import { useTranslationSaveFeedback } from "./useTranslationSaveFeedback";

const mockResetFormsState = jest.fn();
const mockNotify = jest.fn();

jest.mock("@dashboard/components/Form/useExitFormDialog", () => ({
  useExitFormDialog: () => ({ resetFormsState: mockResetFormsState }),
}));
jest.mock("@dashboard/hooks/useNotifier/useNotifier", () => ({
  useNotifier: () => mockNotify,
}));

const Wrapper = ({ children }: PropsWithChildren): JSX.Element => (
  <IntlProvider locale="en" messages={{}}>
    {children}
  </IntlProvider>
);

describe("useTranslationSaveFeedback", () => {
  beforeEach(() => jest.clearAllMocks());

  it("clears the exit guard before navigating after a successful field save", () => {
    // Arrange
    const events: string[] = [];

    mockResetFormsState.mockImplementation(() => events.push("clear dirty form"));

    const { result } = renderHook(
      () =>
        useTranslationSaveFeedback({
          refetch: jest.fn(),
          exitEditMode: () => events.push("exit edit mode"),
          exitBulkMode: jest.fn(),
        }),
      { wrapper: Wrapper },
    );

    // Act
    act(() => {
      result.current.completeSingleFieldSave([]);
    });

    // Assert
    expect(events).toEqual(["clear dirty form", "exit edit mode"]);
  });

  it("keeps the exit guard and edit mode when a field save fails", () => {
    // Arrange
    const exitEditMode = jest.fn();
    const { result } = renderHook(
      () =>
        useTranslationSaveFeedback({
          refetch: jest.fn(),
          exitEditMode,
          exitBulkMode: jest.fn(),
        }),
      { wrapper: Wrapper },
    );

    // Act
    act(() => {
      result.current.completeSingleFieldSave([{ field: "fullDescription" }]);
    });

    // Assert
    expect(mockResetFormsState).not.toHaveBeenCalled();
    expect(exitEditMode).not.toHaveBeenCalled();
  });

  it("clears the exit guard before navigating after a successful bulk save", () => {
    // Arrange
    const events: string[] = [];

    mockResetFormsState.mockImplementation(() => events.push("clear dirty form"));

    const { result } = renderHook(
      () =>
        useTranslationSaveFeedback({
          refetch: jest.fn(),
          exitEditMode: jest.fn(),
          exitBulkMode: () => events.push("exit bulk mode"),
        }),
      { wrapper: Wrapper },
    );

    // Act
    act(() => {
      result.current.completeBulkSave(createBulkSubmitResult([]));
    });

    // Assert
    expect(events).toEqual(["clear dirty form", "exit bulk mode"]);
  });

  it("keeps unsaved fields protected when a bulk save fails", () => {
    // Arrange
    const exitBulkMode = jest.fn();
    const { result } = renderHook(
      () =>
        useTranslationSaveFeedback({
          refetch: jest.fn(),
          exitEditMode: jest.fn(),
          exitBulkMode,
        }),
      { wrapper: Wrapper },
    );

    // Act
    act(() => {
      result.current.completeBulkSave(
        createBulkSubmitResult([{ fieldName: "fullDescription", message: "Invalid description" }]),
      );
    });

    // Assert
    expect(mockResetFormsState).not.toHaveBeenCalled();
    expect(exitBulkMode).not.toHaveBeenCalled();
    expect(result.current.fieldErrors).toEqual({ fullDescription: "Invalid description" });
  });
});
