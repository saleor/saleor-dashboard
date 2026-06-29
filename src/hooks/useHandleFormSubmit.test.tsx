// @ts-strict-ignore
import { ExitFormDialogContext } from "@dashboard/components/Form/ExitFormDialogProvider";
import { useExitFormDialog } from "@dashboard/components/Form/useExitFormDialog";
import { useExitFormDialogProvider } from "@dashboard/components/Form/useExitFormDialogProvider";
import useForm from "@dashboard/hooks/useForm";
import { act, renderHook } from "@testing-library/react";
import { useHistory } from "react-router";
import { MemoryRouter } from "react-router-dom";

import useHandleFormSubmit from "./useHandleFormSubmit";

jest.mock("./useNotifier", () => ({
  useNotifier: () => jest.fn(),
}));

const MockExitFormDialogProvider = ({ children }: { children: React.ReactNode }) => {
  const provider = useExitFormDialogProvider();

  return (
    <ExitFormDialogContext.Provider value={provider.providerData}>
      {children}
    </ExitFormDialogContext.Provider>
  );
};

describe("useHandleFormSubmit", () => {
  // Regression: dialog forms (e.g. postal code "add range") submit an onSubmit
  // that only dispatches local state and returns void. The submit must still
  // clear the shared submitting flag, otherwise setEnableExitDialog stays gated
  // off and navigation can no longer be blocked for any form on the page.
  it("keeps navigation blocking working after a void onSubmit", () => {
    // Arrange
    const { result } = renderHook(
      () => {
        const form = useForm({ field: "" }, () => Promise.resolve([]), { confirmLeave: true });
        const exit = useExitFormDialog();
        const handleVoidSubmit = useHandleFormSubmit<{ field: string }, unknown>({
          onSubmit: () => undefined,
        });
        const history = useHistory();

        return { form, exit, handleVoidSubmit, history };
      },
      {
        wrapper: ({ children }) => (
          <MemoryRouter initialEntries={[{ pathname: "/" }]}>
            <MockExitFormDialogProvider>{children}</MockExitFormDialogProvider>
          </MemoryRouter>
        ),
      },
    );

    // Act - a sibling (dialog) form completes a synchronous void submit, then
    // the main form becomes dirty and tries to navigate away
    act(() => {
      result.current.handleVoidSubmit({ field: "x" });
    });
    act(() => {
      result.current.form.change({ target: { name: "field", value: "something" } });
    });
    act(() => {
      result.current.history.push("/path");
    });

    // Assert - navigation is still blocked despite the earlier void submit
    expect(result.current.exit.shouldBlockNavigation()).toBe(true);
    expect(result.current.history.location.pathname).toBe("/");
  });
});
