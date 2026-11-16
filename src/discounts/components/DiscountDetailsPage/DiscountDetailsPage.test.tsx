import { discount } from "@dashboard/discounts/fixtures";
import { EmpptyLabelsMapsProvider } from "@dashboard/discounts/views/DiscountDetails/context/provider";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import { DiscountDetailsPage } from "./DiscountDetailsPage";

jest.mock("@dashboard/extensions/hooks/useExtensions", () => ({
  useExtensions: (): { DISCOUNT_DETAILS_MORE_ACTIONS: [] } => ({
    DISCOUNT_DETAILS_MORE_ACTIONS: [],
  }),
}));
// The "Open in GraphiQL" action reads the Dev Mode context, which is only
// provided at the app root. Stub the hook so the page renders in isolation.
jest.mock("@dashboard/components/DevModePanel/hooks", () => ({
  useDevModeContext: (): Record<string, jest.Mock> => ({
    setDevModeContent: jest.fn(),
    setVariables: jest.fn(),
    setDevModeVisibility: jest.fn(),
  }),
}));
// The real Savebar portals into a ref the AppLayout provides, and EditorJS
// does not run in jsdom; both have manual mocks.
jest.mock("@dashboard/components/Savebar");
jest.mock("@dashboard/components/RichTextEditor/RichTextEditor");

// Radix primitives used by macaw-ui need ResizeObserver, which jsdom lacks.
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

const renderPage = ({
  data = discount,
  disabled = false,
  onShowMetadata = jest.fn(),
}: {
  data?: typeof discount | null;
  disabled?: boolean;
  onShowMetadata?: () => void;
}): void => {
  render(
    <MemoryRouter>
      <EmpptyLabelsMapsProvider>
        <DiscountDetailsPage
          channels={[]}
          data={data}
          disabled={disabled}
          errors={[]}
          submitButtonState="default"
          onSubmit={jest.fn()}
          onDelete={jest.fn()}
          onShowMetadata={onShowMetadata}
          onRuleUpdateSubmit={jest.fn()}
          ruleUpdateButtonState="default"
          onRuleCreateSubmit={jest.fn()}
          ruleCreateButtonState="default"
          onRuleDeleteSubmit={jest.fn()}
          ruleDeleteButtonState="default"
          onBack={jest.fn()}
          backLinkHref="/discounts/sales"
        />
      </EmpptyLabelsMapsProvider>
    </MemoryRouter>,
    { wrapper: Wrapper },
  );
};

describe("DiscountDetailsPage — promotion metadata", () => {
  it("opens the promotion metadata editor from the top bar", async () => {
    // Arrange
    const onShowMetadata = jest.fn();

    renderPage({ onShowMetadata });

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Edit promotion metadata" }));

    // Assert
    expect(onShowMetadata).toHaveBeenCalledTimes(1);
  });

  it("does not open the editor while the page is loading or saving", async () => {
    // Arrange
    const onShowMetadata = jest.fn();

    renderPage({ disabled: true, onShowMetadata });

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Edit promotion metadata" }));

    // Assert
    expect(onShowMetadata).not.toHaveBeenCalled();
  });

  it("does not open the editor when there is no promotion", async () => {
    // Arrange
    const onShowMetadata = jest.fn();

    renderPage({ data: null, onShowMetadata });

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Edit promotion metadata" }));

    // Assert
    expect(onShowMetadata).not.toHaveBeenCalled();
  });
});
