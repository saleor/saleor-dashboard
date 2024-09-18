import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

import { ServiceWorkerPrompt } from "./index";
import { useNavigatorOnline } from "./useNavigatorOnline";

jest.mock("./useRegisterPW");
jest.mock("./useNavigatorOnline");
jest.mock("react-intl", () => ({
  FormattedMessage: ({ defaultMessage }) => <>{defaultMessage}</>,
}));

describe("ServiceWorkerPrompt", () => {
  const mockUpdateServiceWorker = jest.fn();
  const mockNeedRefresh = [true];

  beforeEach(() => {
    (useRegisterSW as jest.Mock).mockReturnValue({
      needRefresh: mockNeedRefresh,
      updateServiceWorker: mockUpdateServiceWorker,
    });
    (useNavigatorOnline as jest.Mock).mockReturnValue(true);
  });

  it("renders YouAreOffline when offline", () => {
    // Arrange
    (useNavigatorOnline as jest.Mock).mockReturnValue(false);

    // Act
    render(<ServiceWorkerPrompt />);

    // Assert
    expect(screen.getByText(/You are currently offline/i)).toBeInTheDocument();
  });

  it("renders NewVersionAvailable when a new version is available", () => {
    // Arrange & Act
    render(<ServiceWorkerPrompt />);

    // Assert
    expect(screen.getByText(/New dashboard version available/i)).toBeInTheDocument();
  });

  it("calls updateServiceWorker and reloads the window on update", async () => {
    // Arrange
    render(<ServiceWorkerPrompt />);

    const updateButton = screen.getByText(/Click here to reload/i);

    // Act
    fireEvent.click(updateButton);

    // Assert
    expect(mockUpdateServiceWorker).toHaveBeenCalled();
  });
});
