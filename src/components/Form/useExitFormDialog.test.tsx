import useForm, { SubmitPromise } from "@saleor/hooks/useForm";
import { act, renderHook } from "@testing-library/react-hooks";
import React from "react";
import { useHistory } from "react-router";
import { MemoryRouter } from "react-router-dom";

import {
  ExitFormDialogContext,
  useExitFormDialogProvider,
} from "./ExitFormDialogProvider";
import { useExitFormDialog } from "./useExitFormDialog";

jest.mock("../../hooks/useNotifier", () => undefined);

const MockExitFormDialogProvider = ({ children }) => {
  const { providerData } = useExitFormDialogProvider();
  return (
    <ExitFormDialogContext.Provider value={providerData}>
      {children}
    </ExitFormDialogContext.Provider>
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

  it("blocks navigation if an error occured", async () => {
    // Given
    const submitFn = jest.fn(() =>
      Promise.resolve([{ field: "field", code: "code" }]),
    );
    const { result } = setup(submitFn);

    // When
    act(() => {
      result.current.form.change({
        target: { name: "field", value: "something" },
      });
      result.current.history.push(targetPath);
    });
    await act(() => result.current.exit.submit());

    // Then
    expect(result.current.history.location.pathname).toBe(initialPath);
  });

  it("allows navigation if an error occured, but confirmation is not needed", async () => {
    // Given
    const submitFn = jest.fn(() =>
      Promise.resolve([{ field: "field", code: "code" }]),
    );
    const { result } = setup(submitFn, false);

    // When
    act(() => {
      result.current.form.change({
        target: { name: "field", value: "something" },
      });
      result.current.history.push(targetPath);
    });
    await act(() => result.current.exit.submit());

    // Then
    expect(result.current.history.location.pathname).toBe(targetPath);
  });

  it("blocks navigation if an error occured and user tries to leave anyway", async () => {
    // Given
    const submitFn = jest.fn(() =>
      Promise.resolve([{ field: "field", code: "code" }]),
    );
    const { result } = setup(submitFn);

    // When
    act(() => {
      result.current.form.change({
        target: { name: "field", value: "something" },
      });
      result.current.history.push(targetPath);
    });
    await act(() => result.current.exit.submit());
    act(() => {
      result.current.history.push(targetPath);
    });

    // Then
    expect(result.current.exit.shouldBlockNavigation()).toBe(true);
    expect(result.current.history.location.pathname).toBe(initialPath);
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
