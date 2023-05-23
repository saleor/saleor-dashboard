import { appDetails } from "@dashboard/apps/fixtures";
import { render } from "@testing-library/react";
import React from "react";

import Header from "./Header";

const mockHeaderOptions = vi.fn();
const mockTopNav = vi.fn();

vi.mock("@dashboard/components/AppLayout/TopNav", () => ({
  TopNav: props => {
    mockTopNav(props);
    return <>{props.children}</>;
  },
}));
vi.mock("../DeactivatedText", () => ({ default: () => "deactivated" }));
vi.mock("react-intl", () => ({
  useIntl: vi.fn(() => ({
    formatMessage: vi.fn(x => x.defaultMessage),
  })),
  defineMessages: vi.fn(x => x),
  FormattedMessage: ({ defaultMessage }) => <>{defaultMessage}</>,
}));
vi.mock("./HeaderOptions", () => ({
  default: props => {
    mockHeaderOptions(props);
    return <></>;
  },
}));

beforeEach(() => {
  mockHeaderOptions.mockClear();
  mockTopNav.mockClear();
});

describe("Apps AppDetailsPage Header", () => {
  it("displays app details options when active app data passed", () => {
    // Arrange
    const onAppActivateOpen = vi.fn();
    const onAppDeactivateOpen = vi.fn();
    const onAppDeleteOpen = vi.fn();

    // Act
    render(
      <Header
        data={appDetails}
        onAppActivateOpen={onAppActivateOpen}
        onAppDeactivateOpen={onAppDeactivateOpen}
        onAppDeleteOpen={onAppDeleteOpen}
      />,
    );
    const title = render(mockTopNav.mock.calls[0][0].title);

    // Assert
    expect(mockHeaderOptions).toHaveBeenCalledWith({
      data: appDetails,
      onAppActivateOpen,
      onAppDeactivateOpen,
      onAppDeleteOpen,
    });
    expect(mockTopNav).toHaveBeenCalled();
    expect(title.container).toHaveTextContent(appDetails.name as string);
  });

  it("displays app details options when inactive app data passed", () => {
    // Arrange
    const onAppActivateOpen = vi.fn();
    const onAppDeactivateOpen = vi.fn();
    const onAppDeleteOpen = vi.fn();

    // Act
    render(
      <Header
        data={{ ...appDetails, isActive: false }}
        onAppActivateOpen={onAppActivateOpen}
        onAppDeactivateOpen={onAppDeactivateOpen}
        onAppDeleteOpen={onAppDeleteOpen}
      />,
    );
    const title = render(mockTopNav.mock.calls[0][0].title);

    // Assert
    expect(mockHeaderOptions).toHaveBeenCalledWith({
      data: { ...appDetails, isActive: false },
      onAppActivateOpen,
      onAppDeactivateOpen,
      onAppDeleteOpen,
    });
    expect(mockTopNav).toHaveBeenCalled();
    expect(title.container).toHaveTextContent(`${appDetails.name} deactivated`);
  });
});
