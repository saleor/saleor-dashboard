import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";

import { AppReloadDialog, type AppReloadPreview } from "./AppReloadDialog";
import msgs from "./messages";

jest.mock("./ManifestDiff", () => ({
  ManifestDiff: () => <div data-test-id="manifest-diff" />,
}));

const baseProps = {
  confirmButtonState: "default" as const,
  open: true,
  name: "Test App",
  previewLoading: false,
  previewError: null,
  preview: null,
  onClose: jest.fn(),
  onConfirm: jest.fn(),
};

describe("Extensions AppReloadDialog", () => {
  it("displays a loading skeleton while the preview is fetched", () => {
    // Arrange
    render(
      <Wrapper>
        <AppReloadDialog {...baseProps} previewLoading={true} />
      </Wrapper>,
    );

    // Assert
    expect(screen.getByTestId("reload-dialog-loading")).toBeInTheDocument();
    expect(screen.getByTestId("submit")).toBeDisabled();
  });

  it("displays the fetch error and disables confirmation when the preview fails", () => {
    // Arrange
    const errorMessage = "Unable to fetch manifest data.";

    render(
      <Wrapper>
        <AppReloadDialog {...baseProps} previewError={errorMessage} />
      </Wrapper>,
    );

    // Assert
    const error = screen.getByTestId("reload-dialog-error");

    expect(error).toHaveTextContent(msgs.fetchError.defaultMessage);
    expect(error).toHaveTextContent(errorMessage);
    expect(screen.getByTestId("submit")).toBeDisabled();
  });

  it("displays the up to date state and disables confirmation when there are no changes", () => {
    // Arrange
    const manifest = JSON.stringify({ name: "Test App" });
    const preview: AppReloadPreview = {
      currentManifest: manifest,
      incomingManifest: manifest,
    };

    render(
      <Wrapper>
        <AppReloadDialog {...baseProps} preview={preview} />
      </Wrapper>,
    );

    // Assert
    expect(screen.getByTestId("reload-dialog-up-to-date")).toHaveTextContent(
      msgs.upToDate.defaultMessage,
    );
    expect(screen.getByTestId("submit")).toBeDisabled();
  });

  it("displays the diff with a warning and enables confirmation when the manifest changed", async () => {
    // Arrange
    const preview: AppReloadPreview = {
      currentManifest: JSON.stringify({ name: "Test App" }),
      incomingManifest: JSON.stringify({ name: "Renamed App" }),
    };

    render(
      <Wrapper>
        <AppReloadDialog {...baseProps} preview={preview} />
      </Wrapper>,
    );

    // Assert
    const diffSection = screen.getByTestId("reload-dialog-diff");

    expect(diffSection).toHaveTextContent(msgs.reloadWarning.defaultMessage);
    expect(await screen.findByTestId("manifest-diff")).toBeInTheDocument();
    expect(screen.getByTestId("submit")).toBeEnabled();
  });
});
