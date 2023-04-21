import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { act } from "react-dom/test-utils";

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
// jest.spyOn(console, "error").mockImplementation(() => jest.fn());
describe("ChannelPermission", () => {
  it("should render by default header and checkbox", () => {
    // Arrange & Act
    render(
      <ChannelPermission
        selectedChannels={[]}
        allChannels={allChannels}
        channelsDisplayValues={[]}
        disabled={false}
        onChannelChange={jest.fn}
        onHasRestrictedChannelsChange={jest.fn}
        hasRestrictedChannels={false}
      />,
    );

    // Assert
    expect(screen.getByText(/channels permissions/i)).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).not.toBeChecked();
    expect(
      screen.getByText(/restrict access to channels/i),
    ).toBeInTheDocument();
  });

  it("should render channels select when checkbox is checked", () => {
    // Arrange & Act
    render(
      <ChannelPermission
        selectedChannels={[]}
        allChannels={allChannels}
        channelsDisplayValues={[]}
        disabled={false}
        onChannelChange={jest.fn}
        onHasRestrictedChannelsChange={jest.fn}
        hasRestrictedChannels={true}
      />,
    );

    // Assert
    expect(screen.getByRole("checkbox")).toBeChecked();
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("should render restricted checkbox disabled", () => {
    // Arrange & Act
    const mockOnHasRestrictedChannelsChange = jest.fn();

    render(
      <ChannelPermission
        selectedChannels={[]}
        allChannels={allChannels}
        channelsDisplayValues={[]}
        disabled={true}
        onChannelChange={jest.fn}
        onHasRestrictedChannelsChange={mockOnHasRestrictedChannelsChange}
        hasRestrictedChannels={false}
      />,
    );

    // Act
    userEvent.click(screen.getByRole("checkbox"));

    // Assert
    expect(mockOnHasRestrictedChannelsChange).not.toHaveBeenCalled();
    expect(screen.getByRole("checkbox")).toBeDisabled();
  });

  it("should render selected channels when has restricted channels selected", () => {
    // Arrange & Act
    const selectedChannels = [allChannels[1]];
    render(
      <ChannelPermission
        selectedChannels={selectedChannels.map(x => x.id)}
        allChannels={allChannels}
        channelsDisplayValues={selectedChannels.map(x => ({
          label: x.name,
          value: x.id,
        }))}
        disabled={false}
        onChannelChange={jest.fn}
        onHasRestrictedChannelsChange={jest.fn}
        hasRestrictedChannels={true}
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
        selectedChannels={selectedChannels.map(x => x.id)}
        allChannels={allChannels}
        channelsDisplayValues={selectedChannels.map(x => ({
          label: x.name,
          value: x.id,
        }))}
        disabled={false}
        onChannelChange={jest.fn}
        onHasRestrictedChannelsChange={jest.fn}
        hasRestrictedChannels={true}
      />,
    );

    // Assert
    expect(screen.getByText(selectedChannels[0].name)).toBeInTheDocument();

    // Act
    userEvent.click(screen.getByTestId("channels-remove"));

    // Assert
    expect(screen.getByText(selectedChannels[0].name)).toBeInTheDocument();
  });

  it.skip("should be able to select resticted channels", async () => {
    // Arrange
    const mockOnChannelChange = jest.fn();
    const user = userEvent.setup();

    render(
      <ChannelPermission
        selectedChannels={[]}
        allChannels={allChannels}
        channelsDisplayValues={[]}
        disabled={false}
        onChannelChange={mockOnChannelChange}
        onHasRestrictedChannelsChange={jest.fn()}
        hasRestrictedChannels={true}
      />,
    );

    // Act
    await act(async () => {
      user.click(await screen.findByTestId("multiAutocompleteSelectField"));
    });
    screen.debug();
    // await userEvent.click(
    //   await screen.findByTestId("multi-autocomplete-select-option")[0],
    // );
    // await userEvent.click(
    //   await screen.findByTestId("multi-autocomplete-select-option")[2],
    // );
    // await userEvent.click(await screen.findByRole("combobox"));

    // Assert
    // expect(mockOnChannelChange).toBeCalledTimes(2);

    // expect(await screen.findByText("Channel-1")).toBeInTheDocument();
    // expect(await screen.findByText(allChannels[2].name)).toBeInTheDocument();
  });
});
