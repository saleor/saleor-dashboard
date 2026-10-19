import ExitFormDialogProvider from "@dashboard/components/Form/ExitFormDialogProvider";
import { useExitFormDialog } from "@dashboard/components/Form/useExitFormDialog";
import useForm, { type UseFormResult } from "@dashboard/hooks/useForm";
import { ThemeProvider } from "@saleor/macaw-ui-next";
import { act, renderHook } from "@testing-library/react";
import { type PropsWithChildren } from "react";
import { useHistory } from "react-router";
import { MemoryRouter } from "react-router-dom";

import { createBulkSubmitResult } from "../bulkSubmitResult";
import { useTranslationSaveFeedback } from "./useTranslationSaveFeedback";

jest.mock("@dashboard/hooks/useNotifier/useNotifier", () => ({
  useNotifier: (): jest.Mock => jest.fn(),
}));

const Wrapper = ({ children }: PropsWithChildren): JSX.Element => (
  <MemoryRouter initialEntries={["/translations"]}>
    <ThemeProvider>
      <ExitFormDialogProvider>{children}</ExitFormDialogProvider>
    </ThemeProvider>
  </MemoryRouter>
);

const useSaveWithSiblingForm = (): {
  form: UseFormResult<{ name: string }>;
  feedback: ReturnType<typeof useTranslationSaveFeedback>;
  exit: ReturnType<typeof useExitFormDialog>;
  history: ReturnType<typeof useHistory>;
} => {
  const form = useForm({ name: "" }, async (): Promise<unknown[]> => [], {
    confirmLeave: true,
  });
  const feedback = useTranslationSaveFeedback({ refetch: jest.fn() });
  const exit = useExitFormDialog();
  const history = useHistory();

  return { form, feedback, exit, history };
};

describe("translation save feedback with the exit form provider", () => {
  it.each(["single", "bulk"])(
    "keeps another dirty form protected after a successful %s save",
    kind => {
      // Arrange
      const { result } = renderHook(useSaveWithSiblingForm, { wrapper: Wrapper });

      act(() => {
        result.current.form.change({ target: { name: "name", value: "Another draft" } });
      });
      expect(window.dispatchEvent(new Event("beforeunload", { cancelable: true }))).toBe(false);

      // Act
      act(() => {
        if (kind === "single") {
          result.current.feedback.completeSingleFieldSave([]);
        } else {
          result.current.feedback.completeBulkSave(createBulkSubmitResult([]));
        }
      });
      act(() => result.current.history.push("/elsewhere"));

      // Assert
      expect(result.current.history.location.pathname).toBe("/translations");
      expect(result.current.exit.showDialog).toBe(true);
      expect(result.current.form.data.name).toBe("Another draft");
    },
  );

  it("keeps a pristine sibling registered so later edits are protected", () => {
    // Arrange
    const { result } = renderHook(useSaveWithSiblingForm, { wrapper: Wrapper });

    // Act
    act(() => result.current.feedback.completeSingleFieldSave([]));
    act(() => {
      result.current.form.change({ target: { name: "name", value: "A later draft" } });
    });
    act(() => result.current.history.push("/elsewhere"));

    // Assert
    expect(result.current.history.location.pathname).toBe("/translations");
    expect(result.current.exit.showDialog).toBe(true);
  });
});
