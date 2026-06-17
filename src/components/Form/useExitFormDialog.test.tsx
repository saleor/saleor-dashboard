// @ts-strict-ignore
import useForm, { type SubmitPromise } from "@dashboard/hooks/useForm";
import { act, renderHook } from "@testing-library/react";
import { useHistory } from "react-router";
import { MemoryRouter } from "react-router-dom";

import { ExitFormDialogContext } from "./ExitFormDialogProvider";
import { useExitFormDialog } from "./useExitFormDialog";
import { useExitFormDialogProvider } from "./useExitFormDialogProvider";

jest.mock("../../hooks/useNotifier", () => ({
  useNotifier: () => jest.fn(),
}));

const MockExitFormDialogProvider = ({
  children,
  onProvider,
}: {
  children: React.ReactNode;
  onProvider?: (provider: ReturnType<typeof useExitFormDialogProvider>) => void;
}) => {
  const provider = useExitFormDialogProvider();

  onProvider?.(provider);

  return (
    <ExitFormDialogContext.Provider value={provider.providerData}>
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
  it("blocks query navigation on same pathname when form is dirty", async () => {
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
      result.current.history.push("/?bulk=1");
    });

    // Then
    expect(result.current.exit.shouldBlockNavigation()).toBe(true);
    expect(result.current.history.location.search).toBe("");
  });
  it("allows query navigation on same pathname when form is clean", async () => {
    // Given
    const submitFn = jest.fn(() => Promise.resolve([]));
    const { result } = setup(submitFn);

    // When
    act(() => {
      result.current.history.push("/?bulk=1");
    });

    // Then
    expect(result.current.exit.shouldBlockNavigation()).toBe(false);
    expect(result.current.history.location.search).toBe("?bulk=1");
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

  it("blocks navigation again after keep editing", async () => {
    // Arrange
    const submitFn = jest.fn(() => Promise.resolve([]));
    let provider: ReturnType<typeof useExitFormDialogProvider> | undefined;
    const { result } = renderHook(
      () => {
        const form = useForm({ field: "" }, submitFn, { confirmLeave: true });
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
            <MockExitFormDialogProvider onProvider={value => (provider = value)}>
              {children}
            </MockExitFormDialogProvider>
          </MemoryRouter>
        ),
      },
    );

    // Act - first blocked navigation
    act(() => {
      result.current.form.change({
        target: { name: "field", value: "something" },
      });
    });
    act(() => {
      result.current.history.push("/?bulk=1");
    });

    // Assert
    expect(result.current.exit.shouldBlockNavigation()).toBe(true);
    expect(provider?.showDialog).toBe(true);

    // Act - keep editing
    act(() => {
      provider?.handleClose();
    });

    // Assert
    expect(provider?.showDialog).toBe(false);
    expect(result.current.exit.shouldBlockNavigation()).toBe(false);

    // Act - second blocked navigation
    act(() => {
      result.current.history.push("/?bulk=1");
    });

    // Assert
    expect(result.current.exit.shouldBlockNavigation()).toBe(true);
    expect(provider?.showDialog).toBe(true);
    expect(result.current.history.location.search).toBe("");
  });

  it("blocks browser back again after keep editing", async () => {
    // Arrange
    const submitFn = jest.fn(() => Promise.resolve([]));
    let provider: ReturnType<typeof useExitFormDialogProvider> | undefined;
    const { result } = renderHook(
      () => {
        const form = useForm({ field: "" }, submitFn, { confirmLeave: true });
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
          <MemoryRouter
            initialEntries={[{ pathname: "/previous" }, { pathname: "/current" }]}
            initialIndex={1}
          >
            <MockExitFormDialogProvider onProvider={value => (provider = value)}>
              {children}
            </MockExitFormDialogProvider>
          </MemoryRouter>
        ),
      },
    );

    // Act - first blocked browser back
    act(() => {
      result.current.form.change({
        target: { name: "field", value: "something" },
      });
    });
    act(() => {
      result.current.history.goBack();
    });

    // Assert
    expect(result.current.exit.shouldBlockNavigation()).toBe(true);
    expect(provider?.showDialog).toBe(true);
    expect(result.current.history.location.pathname).toBe("/current");

    // Act - keep editing
    act(() => {
      provider?.handleClose();
    });

    // Assert
    expect(provider?.showDialog).toBe(false);

    // Act - second blocked browser back
    act(() => {
      result.current.history.goBack();
    });

    // Assert
    expect(result.current.exit.shouldBlockNavigation()).toBe(true);
    expect(provider?.showDialog).toBe(true);
    expect(result.current.history.location.pathname).toBe("/current");
  });

  it("keeps current query string when browser back to bulk mode is blocked", () => {
    // Arrange - simulates single-field edit after bulk mode was on earlier in history
    const submitFn = jest.fn(() => Promise.resolve([]));
    let provider: ReturnType<typeof useExitFormDialogProvider> | undefined;
    const { result } = renderHook(
      () => {
        const form = useForm({ field: "" }, submitFn, { confirmLeave: true });
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
          <MemoryRouter
            initialEntries={[
              { pathname: "/entity", search: "?bulk=1" },
              { pathname: "/entity", search: "?activeField=name" },
            ]}
            initialIndex={1}
          >
            <MockExitFormDialogProvider onProvider={value => (provider = value)}>
              {children}
            </MockExitFormDialogProvider>
          </MemoryRouter>
        ),
      },
    );

    // Act
    act(() => {
      result.current.form.change({
        target: { name: "field", value: "something" },
      });
    });
    act(() => {
      result.current.history.goBack();
    });

    // Assert - must stay on single-field edit, not revert to bulk query
    expect(provider?.showDialog).toBe(true);
    expect(result.current.history.location.search).toBe("?activeField=name");
  });
});
