import { ExitFormDialogContext } from "@dashboard/components/Form/ExitFormDialogProvider";
import { useExitFormDialogProvider } from "@dashboard/components/Form/useExitFormDialogProvider";
import { useDiscountFormExit } from "@dashboard/discounts/components/DiscountDetailsForm/useDiscountFormExit";
import { PromotionDeleteErrorCode, type PromotionDeleteMutation } from "@dashboard/graphql";
import type * as GraphqlTypes from "@dashboard/graphql/types.generated";
import { act, renderHook, type RenderHookResult } from "@testing-library/react";
import { type ReactNode, useContext } from "react";
import type * as ReactIntl from "react-intl";
import { useHistory } from "react-router";
import { MemoryRouter } from "react-router-dom";

import { usePromotionDelete } from "./usePromotionDelete";

interface MutationOptions {
  onCompleted?: (data: PromotionDeleteMutation) => void;
}

let deleteOptions: MutationOptions = {};

jest.mock("@dashboard/graphql", () => ({
  ...jest.requireActual<typeof GraphqlTypes>("@dashboard/graphql/types.generated"),
  usePromotionDeleteMutation: (options: MutationOptions): [jest.Mock, object] => {
    deleteOptions = options;

    return [jest.fn(), { loading: false }];
  },
}));
jest.mock("@dashboard/hooks/useNotifier/useNotifier", () => ({
  useNotifier: (): jest.Mock => jest.fn(),
}));
jest.mock("react-intl", () => ({
  ...jest.requireActual<typeof ReactIntl>("react-intl"),
  useIntl: (): { formatMessage: (message: { defaultMessage: string }) => string } => ({
    formatMessage: message => message.defaultMessage,
  }),
}));

const promotionPath = "/discounts/sales/UHJvbW90aW9uOjE%3D";
const deleted: PromotionDeleteMutation = {
  __typename: "Mutation",
  promotionDelete: { __typename: "PromotionDelete", errors: [] },
};
const refused: PromotionDeleteMutation = {
  __typename: "Mutation",
  promotionDelete: {
    __typename: "PromotionDelete",
    errors: [
      {
        __typename: "PromotionDeleteError",
        field: null,
        message: "Promotion not found.",
        code: PromotionDeleteErrorCode.NOT_FOUND,
      },
    ],
  },
};

const ExitFormDialogProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const { providerData } = useExitFormDialogProvider();

  return (
    <ExitFormDialogContext.Provider value={providerData}>{children}</ExitFormDialogContext.Provider>
  );
};

interface PromotionPage {
  history: ReturnType<typeof useHistory>;
  leavePromptOpen: boolean;
}

/** The promotion page with an edit that hasn't been saved. */
const renderPromotionWithUnsavedEdit = (): RenderHookResult<PromotionPage, unknown> =>
  renderHook(
    (): PromotionPage => {
      useDiscountFormExit({ enabled: true, isDirty: true });
      usePromotionDelete();

      return {
        history: useHistory(),
        leavePromptOpen: useContext(ExitFormDialogContext).showDialog,
      };
    },
    {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={[promotionPath]}>
          <ExitFormDialogProvider>{children}</ExitFormDialogProvider>
        </MemoryRouter>
      ),
    },
  );

describe("usePromotionDelete", () => {
  it("opens the promotions list without asking to keep the deleted promotion's edits", () => {
    // Arrange
    const { result } = renderPromotionWithUnsavedEdit();

    // Act
    act(() => {
      deleteOptions.onCompleted?.(deleted);
    });

    // Assert
    expect(result.current.history.location.pathname).toBe("/discounts/sales");
    expect(result.current.leavePromptOpen).toBe(false);
  });

  it("keeps the unsaved edits guarded when the delete is refused", () => {
    // Arrange
    const { result } = renderPromotionWithUnsavedEdit();

    // Act
    act(() => {
      deleteOptions.onCompleted?.(refused);
    });
    act(() => {
      result.current.history.push("/discounts/sales");
    });

    // Assert
    expect(result.current.history.location.pathname).toBe(promotionPath);
    expect(result.current.leavePromptOpen).toBe(true);
  });
});
