// @ts-strict-ignore
import useForm, { SubmitPromise } from "@dashboard/hooks/useForm";
import { act, renderHook } from "@testing-library/react-hooks";
import React from "react";
import { useHistory } from "react-router";
import { MemoryRouter } from "react-router-dom";

import { ExitFormDialogContext } from "./ExitFormDialogProvider";
import { useExitFormDialog } from "./useExitFormDialog";
import { useExitFormDialogProvider } from "./useExitFormDialogProvider";

jest.mock("../../hooks/useNotifier", () => undefined);

const MockExitFormDialogProvider = ({ children }) => {
  const { providerData } = useExitFormDialogProvider();
  return (
    <ExitFormDialogContext.Provider value={providerData}>{children}</ExitFormDialogContext.Provider>
  );
};
const initialPath = "/";
const targetPath = "/path";
const setup = (submitFn: () => SubmitPromise, confirmLeave = true) =>
  renderHook(
    () => {
      const form = useForm({ field: "" }, submitFn, { confirmLeave });
      const exit = useExitFormDialog();
      const history = useHistory();

      return {
        form,
        exit,
        history,
      };
    },
    {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <MockExitFormDialogProvider>{children}</MockExitFormDialogProvider>
        </MemoryRouter>
      ),
    },
  );

describe("useExitFormDialog", () => {
  it("blocks navigation after leaving dirty form", async () => {
    // Given
    const submitFn = jest.fn(() => Promise.resolve([]));
    const { result } = setup(submitFn);

    // When
    act(() => {
      result.current.form.change({
        target: { name: "field", value: "something" },
      });
    });
    act(() => {
      result.current.history.push(targetPath);
    });
    // Then
    expect(result.current.exit.shouldBlockNavigation()).toBe(true);
    expect(result.current.history.location.pathname).toBe(initialPath);
  });
  it("allows navigation after leaving dirty form if no confirmation is needed", async () => {
    // Given
    const submitFn = jest.fn(() => Promise.resolve([]));
    const { result } = setup(submitFn, false);

    // When
    act(() => {
      result.current.form.change({
        target: { name: "field", value: "something" },
      });
    });
    act(() => {
      result.current.history.push(targetPath);
    });
    // Then
    expect(result.current.exit.shouldBlockNavigation()).toBe(false);
    expect(result.current.history.location.pathname).toBe(targetPath);
  });
  it("navigates to full url with querystring", async () => {
    // Given
    const submitFn = jest.fn(() => Promise.resolve([]));
    const { result } = setup(submitFn);
    const qs = "?param=value";
    const targetPathWithQs = targetPath + qs;

    // When
    act(() => {
      result.current.form.change({
        target: { name: "field", value: "something" },
      });
    });
    act(() => {
      result.current.history.push(targetPathWithQs);
      result.current.exit.leave();
    });
    // Then
    expect(result.current.history.location.pathname).toBe(targetPath);
    expect(result.current.history.location.search).toBe(qs);
  });
});
