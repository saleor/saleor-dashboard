import { SavebarRefProvider } from "@dashboard/components/Savebar/SavebarRefContext";
import { type TaxConfigurationFragment } from "@dashboard/graphql";
import { taxConfigurations } from "@dashboard/taxes/fixtures";
import Wrapper from "@test/wrapper";
import { render, type RenderResult, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import TaxChannelsPage from "./TaxChannelsPage";

// Radix primitives used by macaw-ui need ResizeObserver, which jsdom lacks.
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

const editMetadataButtonName = "Edit tax configuration metadata";

const renderPage = ({
  configurations,
  onShowMetadata,
}: {
  configurations: TaxConfigurationFragment[] | undefined;
  onShowMetadata: (() => void) | undefined;
}): RenderResult =>
  render(
    <Wrapper>
      <MemoryRouter>
        <SavebarRefProvider>
          <TaxChannelsPage
            taxConfigurations={configurations}
            selectedConfigurationId={taxConfigurations[0].id}
            handleTabChange={jest.fn()}
            allCountries={[]}
            isDialogOpen={false}
            openDialog={jest.fn()}
            closeDialog={jest.fn()}
            onSubmit={jest.fn()}
            savebarState="default"
            disabled={false}
            onShowMetadata={onShowMetadata}
          />
        </SavebarRefProvider>
      </MemoryRouter>
    </Wrapper>,
  );

describe("TaxChannelsPage — tax configuration metadata", () => {
  it("opens the selected channel's metadata from the top bar when the view allows it", async () => {
    // Arrange
    const onShowMetadata = jest.fn();

    renderPage({ configurations: taxConfigurations, onShowMetadata });

    // Act
    await userEvent.click(screen.getByRole("button", { name: editMetadataButtonName }));

    // Assert
    expect(onShowMetadata).toHaveBeenCalledTimes(1);
  });

  it("hides the metadata button when the view doesn't pass a handler", () => {
    // Arrange & Act
    renderPage({ configurations: taxConfigurations, onShowMetadata: undefined });

    // Assert
    expect(screen.getByText("Channel list")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: editMetadataButtonName })).not.toBeInTheDocument();
  });

  it("does not open the editor before the selected channel's tax configuration loads", async () => {
    // Arrange
    const onShowMetadata = jest.fn();

    renderPage({ configurations: undefined, onShowMetadata });

    // Act
    await userEvent.click(screen.getByRole("button", { name: editMetadataButtonName }));

    // Assert
    expect(onShowMetadata).not.toHaveBeenCalled();
  });
});
