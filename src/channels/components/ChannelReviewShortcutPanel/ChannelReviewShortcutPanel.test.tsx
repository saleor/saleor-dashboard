import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Receipt } from "lucide-react";

import { ChannelReviewShortcutPanel } from "./ChannelReviewShortcutPanel";

const navigate = jest.fn();

jest.mock("@dashboard/hooks/useNavigator", () => () => navigate);

describe("ChannelReviewShortcutPanel", () => {
  beforeEach(() => {
    navigate.mockClear();
  });

  it("renders a bordered flat panel and navigates on click", async () => {
    // Arrange
    const user = userEvent.setup();

    // Act
    render(
      <ChannelReviewShortcutPanel
        data-test-id="channel-taxes-shortcut"
        item={{
          id: "tax",
          icon: <Receipt size={16} />,
          title: "Taxes",
          description: "How tax is calculated for this channel.",
          status: "Flat rates",
          onClick: () => navigate("/taxes"),
        }}
      />,
      { wrapper: Wrapper },
    );

    // Assert
    expect(screen.getByTestId("channel-taxes-shortcut")).toBeInTheDocument();
    expect(screen.getByText("How tax is calculated for this channel.")).toBeInTheDocument();
    await user.click(screen.getByTestId("channel-taxes-shortcut-action"));
    expect(navigate).toHaveBeenCalledWith("/taxes");
  });
});
