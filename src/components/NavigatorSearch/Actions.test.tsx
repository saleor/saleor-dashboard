import { type useFeedbackSurvey } from "@dashboard/components/Sidebar/user/useFeedbackSurvey";
import { StaffInviteProvider } from "@dashboard/staff/components/StaffInviteProvider/StaffInviteProvider";
import { ThemeProvider } from "@saleor/macaw-ui-next";
import { act, fireEvent, render, renderHook, screen } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import { MemoryRouter } from "react-router-dom";

import { Actions } from "./Actions";
import { useActionItems } from "./useActionItems";

const mockOpenSurvey = jest.fn();
const availableFeedback = (): ReturnType<typeof useFeedbackSurvey> => ({
  isAvailable: true,
  openSurvey: mockOpenSurvey,
});
const mockFeedbackSurvey = jest.fn(availableFeedback);

jest.mock("@dashboard/components/Sidebar/user/useFeedbackSurvey", () => ({
  useFeedbackSurvey: () => mockFeedbackSurvey(),
}));
jest.mock("@dashboard/hooks/useNavigator", () => ({
  __esModule: true,
  default: () => jest.fn(),
}));

const renderActions = (query: string, onActionClick: () => void = () => undefined) =>
  render(
    <MemoryRouter>
      <IntlProvider defaultLocale="en" locale="en">
        <ThemeProvider>
          <StaffInviteProvider>
            <Actions query={query} onActionClick={onActionClick} />
          </StaffInviteProvider>
        </ThemeProvider>
      </IntlProvider>
    </MemoryRouter>,
  );

describe("Actions", () => {
  beforeEach(() => {
    mockOpenSurvey.mockClear();
    mockFeedbackSurvey.mockImplementation(availableFeedback);
  });

  // useActionItems collects `.command-menu-item` nodes and moves `aria-selected`
  // onto them, and the combobox's aria-activedescendant points at their id — so
  // the option role has to sit on that same node, not on a child.
  it("puts the option role, id and class on a single node", () => {
    // Arrange & Act
    renderActions("go to orders");

    // Assert
    const option = screen.getByRole("option", { name: "Go to orders" });

    expect(option).toHaveClass("command-menu-item");
    expect(option.id).not.toHaveLength(0);
  });

  describe("Share feedback", () => {
    it.each(["feedback", "bug", "idea", "suggestion", "report a problem"])(
      'is found by "%s"',
      query => {
        // Arrange & Act
        renderActions(query);

        // Assert
        expect(screen.getByRole("option", { name: "Share feedback" })).toBeInTheDocument();
      },
    );

    it("is listed under Help when nothing is typed", () => {
      // Arrange & Act
      renderActions("");

      // Assert
      expect(screen.getByText("Help")).toBeInTheDocument();
      expect(screen.getByRole("option", { name: "Share feedback" })).toBeInTheDocument();
    });

    it("is hidden when the feedback survey isn't available", () => {
      // Arrange
      mockFeedbackSurvey.mockImplementation(() => ({
        isAvailable: false,
        openSurvey: mockOpenSurvey,
      }));

      // Act
      renderActions("feedback");

      // Assert
      expect(screen.queryByRole("option", { name: "Share feedback" })).not.toBeInTheDocument();
    });

    it("closes the command menu and opens the feedback survey on click", () => {
      // Arrange
      const onActionClick = jest.fn();

      renderActions("bug", onActionClick);

      // Act
      fireEvent.click(screen.getByRole("option", { name: "Share feedback" }));

      // Assert
      expect(onActionClick).toHaveBeenCalledTimes(1);
      expect(mockOpenSurvey).toHaveBeenCalledWith({ source: "command_menu" });
    });

    it("opens the feedback survey when chosen with the keyboard", () => {
      // Arrange
      const onActionClick = jest.fn();
      const { container } = renderActions("bug", onActionClick);
      const { result } = renderHook(() => useActionItems());

      act(() => {
        result.current.collectItems(container);
        result.current.focusFirst();
      });

      // Act
      act(() => {
        result.current.takeAction();
      });

      // Assert
      expect(onActionClick).toHaveBeenCalledTimes(1);
      expect(mockOpenSurvey).toHaveBeenCalledWith({ source: "command_menu" });
    });
  });
});
