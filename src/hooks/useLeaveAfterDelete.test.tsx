import { ExitFormDialogContext } from "@dashboard/components/Form/ExitFormDialogProvider";
import { useExitFormDialogProvider } from "@dashboard/components/Form/useExitFormDialogProvider";
import useForm, { type SubmitPromise, type UseFormResult } from "@dashboard/hooks/useForm";
import { act, renderHook, type RenderHookResult } from "@testing-library/react";
import { type ReactNode, useContext } from "react";
import { useHistory } from "react-router";
import { MemoryRouter } from "react-router-dom";

import { useLeaveAfterDelete } from "./useLeaveAfterDelete";

jest.mock("@dashboard/hooks/useNotifier/useNotifier", () => ({
  useNotifier: (): jest.Mock => jest.fn(),
}));

interface ItemFormData {
  name: string;
}
interface DetailPage {
  form: UseFormResult<ItemFormData>;
  leaveAfterDelete: (listUrl: string) => void;
  history: ReturnType<typeof useHistory>;
  leavePromptOpen: boolean;
}

const listPath = "/discounts/vouchers";
const filteredList = `${listPath}?query=summer`;
const deletedItemPath = "/discounts/vouchers/Vm91Y2hlcjox";
const submit = (): SubmitPromise => Promise.resolve([]);

const ExitFormDialogProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const { providerData } = useExitFormDialogProvider();

  return (
    <ExitFormDialogContext.Provider value={providerData}>{children}</ExitFormDialogContext.Provider>
  );
};

/** A detail page opened from a filtered list, with an edit that hasn't been saved. */
const renderDetailPageWithUnsavedEdit = (): RenderHookResult<DetailPage, unknown> => {
  const page = renderHook(
    (): DetailPage => ({
      form: useForm<ItemFormData, unknown>({ name: "" }, submit, { confirmLeave: true }),
      leaveAfterDelete: useLeaveAfterDelete(),
      history: useHistory(),
      leavePromptOpen: useContext(ExitFormDialogContext).showDialog,
    }),
    {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={[filteredList, deletedItemPath]} initialIndex={1}>
          <ExitFormDialogProvider>{children}</ExitFormDialogProvider>
        </MemoryRouter>
      ),
    },
  );

  act(() => {
    page.result.current.form.change({ target: { name: "name", value: "Edited" } });
  });

  return page;
};

describe("useLeaveAfterDelete", () => {
  it("opens the list without the leave prompt", () => {
    // Arrange
    const { result } = renderDetailPageWithUnsavedEdit();

    // Act
    act(() => {
      result.current.leaveAfterDelete(listPath);
    });

    // Assert
    expect(result.current.history.location.pathname).toBe(listPath);
    expect(result.current.leavePromptOpen).toBe(false);
  });

  it("takes Back to the list the item was opened from, not to the deleted item", () => {
    // Arrange
    const { result } = renderDetailPageWithUnsavedEdit();

    act(() => {
      result.current.leaveAfterDelete(listPath);
    });

    // Act
    act(() => {
      result.current.history.goBack();
    });

    // Assert
    const { pathname, search } = result.current.history.location;

    expect(`${pathname}${search}`).toBe(filteredList);
  });

  it("stays put when the delete finishes after the page has closed", () => {
    // Arrange
    const { result, unmount } = renderDetailPageWithUnsavedEdit();
    const { history, leaveAfterDelete } = result.current;

    unmount();

    // Act
    act(() => {
      leaveAfterDelete(listPath);
    });

    // Assert
    expect(history.location.pathname).toBe(deletedItemPath);
  });
});
