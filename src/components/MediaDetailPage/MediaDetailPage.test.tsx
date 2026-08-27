import { ExitFormDialogContext } from "@dashboard/components/Form/ExitFormDialogProvider";
import { useExitFormDialogProvider } from "@dashboard/components/Form/useExitFormDialogProvider";
import Wrapper from "@test/wrapper";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import useRouter from "use-react-router";

import { MediaDetailPage } from "./MediaDetailPage";

jest.mock("@dashboard/components/Savebar", () => {
  const Root = ({ children }: { children: ReactNode }) => <div>{children}</div>;
  const DeleteButton = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>Delete</button>
  );
  const CancelButton = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>Back</button>
  );
  const ConfirmButton = ({
    transitionState: _transitionState,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & { transitionState: string }) => (
    <button {...props}>Save</button>
  );
  const Spacer = () => null;

  return {
    Savebar: Object.assign(Root, { DeleteButton, CancelButton, ConfirmButton, Spacer }),
  };
});

const MockExitFormDialogProvider = ({ children }: { children: ReactNode }) => {
  const provider = useExitFormDialogProvider();

  return (
    <ExitFormDialogContext.Provider value={provider.providerData}>
      {children}
    </ExitFormDialogContext.Provider>
  );
};

const LocationPath = () => {
  const { location } = useRouter();

  return <div data-test-id="location-path">{location.pathname}</div>;
};

const renderPage = (onSubmit: (data: { alt: string }) => Promise<unknown[]>) =>
  render(
    <MemoryRouter initialEntries={["/categories/category-1/media/media-1"]}>
      <MockExitFormDialogProvider>
        <Wrapper>
          <MediaDetailPage
            ownerUrl="/categories/category-1"
            ownerIcon={<span />}
            ownerListLabel="Categories"
            ownerName="Accessories"
            disabled={false}
            mediaObj={{
              id: "media-1",
              alt: "Old alt",
              url: "https://example.com/media.png",
              type: "IMAGE",
            }}
            media={[{ id: "media-1", url: "https://example.com/media.png" }]}
            saveButtonBarState="default"
            onDelete={() => undefined}
            onRowClick={() => () => undefined}
            onShowMetadata={() => undefined}
            onSubmit={onSubmit}
          />
          <LocationPath />
        </Wrapper>
      </MockExitFormDialogProvider>
    </MemoryRouter>,
  );

describe("MediaDetailPage", () => {
  it("returns to the owner after a successful save has cleared the dirty state", async () => {
    // Arrange
    const onSubmit = jest.fn(async () => []);

    renderPage(onSubmit);
    fireEvent.change(screen.getByRole("textbox"), {
      target: { name: "alt", value: "New alt" },
    });

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    // Assert
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ alt: "New alt" });
      expect(screen.getByTestId("location-path").textContent).toBe("/categories/category-1");
    });
  });

  it("stays on the media view when the save returns errors", async () => {
    // Arrange
    const onSubmit = jest.fn(async () => [{ message: "Update failed" }]);

    renderPage(onSubmit);
    fireEvent.change(screen.getByRole("textbox"), {
      target: { name: "alt", value: "New alt" },
    });

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    // Assert
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ alt: "New alt" }));
    expect(screen.getByTestId("location-path").textContent).toBe(
      "/categories/category-1/media/media-1",
    );
  });
});
