import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import { ChannelPermission } from "./ChannelPermission";
import { allChannels } from "./fixtures";

jest.mock("react-intl", () => ({
  useIntl: jest.fn(() => ({
    formatMessage: jest.fn(x => x.defaultMessage),
  })),
  defineMessages: jest.fn(x => x),
  FormattedMessage: ({ defaultMessage }) => <>{defaultMessage}</>,
}));

jest.mock("@saleor/macaw-ui", () => ({
  useStyles: jest.fn(() => () => ({})),
  makeStyles: jest.fn(() => () => ({})),
  ChevronIcon: jest.fn(() => () => <></>),
  IconButton: props => <button {...props} />,
}));

describe("ChannelPermission", () => {
  it("should render by default header and checkbox", () => {
    // Arrange & Act
    render(
      <ChannelPermission
        selectedChannels={[]}
        allChannels={allChannels}
        disabled={false}
        disabledSelectAllChannls={false}
        onChannelChange={jest.fn}
        onHasAllChannelsChange={jest.fn}
        hasAllChannels={true}
      />,
    );

    // Assert
    expect(screen.getByText(/channels permissions/i)).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).toBeChecked();
    expect(
      screen.getByText(/allow access to all channels/i),
    ).toBeInTheDocument();
  });

  it("should render channels select when access to all channels checkbox unchecked", () => {
    // Arrange & Act
    render(
      <ChannelPermission
        selectedChannels={[]}
        allChannels={allChannels}
        disabled={false}
        disabledSelectAllChannls={false}
        onChannelChange={jest.fn}
        onHasAllChannelsChange={jest.fn}
        hasAllChannels={false}
      />,
    );

    // Assert
    expect(screen.getByRole("checkbox")).not.toBeChecked();
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("should render restricted checkbox disabled", () => {
    // Arrange & Act
    const mockonHasAllChannelsChange = jest.fn();

    render(
      <ChannelPermission
        selectedChannels={[]}
        allChannels={allChannels}
        disabled={true}
        disabledSelectAllChannls={false}
        onChannelChange={jest.fn}
        onHasAllChannelsChange={mockonHasAllChannelsChange}
        hasAllChannels={true}
      />,
    );

    // Act
    userEvent.click(screen.getByRole("checkbox"));

    // Assert
    expect(mockonHasAllChannelsChange).not.toHaveBeenCalled();
    expect(screen.getByRole("checkbox")).toBeDisabled();
  });

  it("should render selected channels when has restricted channels selected", () => {
    // Arrange & Act
    const selectedChannels = [allChannels[1]];
    render(
      <ChannelPermission
        allChannels={allChannels}
        selectedChannels={selectedChannels.map(x => ({
          label: x.name,
          value: x.id,
        }))}
        disabled={false}
        disabledSelectAllChannls={false}
        onChannelChange={jest.fn}
        onHasAllChannelsChange={jest.fn}
        hasAllChannels={false}
      />,
    );

    // Assert
    expect(screen.getByText(selectedChannels[0].name)).toBeInTheDocument();
  });

  it("should allow to remove selected channels", () => {
    // Arrange & Act
    const selectedChannels = [allChannels[1]];
    render(
      <ChannelPermission
        allChannels={allChannels}
        selectedChannels={selectedChannels.map(x => ({
          label: x.name,
          value: x.id,
        }))}
        disabled={false}
        disabledSelectAllChannls={false}
        onChannelChange={jest.fn}
        onHasAllChannelsChange={jest.fn}
        hasAllChannels={false}
      />,
    );

    // Assert
    expect(screen.getByText(selectedChannels[0].name)).toBeInTheDocument();

    // Act
    userEvent.click(screen.getByTestId("channels-remove"));

    // Assert
    expect(screen.getByText(selectedChannels[0].name)).toBeInTheDocument();
  });
});
