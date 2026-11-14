import { InMemoryCache } from "@apollo/client";
import { MockedProvider, type MockedResponse } from "@apollo/client/testing";
import {
  MenuMetadataDocument,
  type MenuMetadataQuery,
  type MenuMetadataQueryVariables,
  UpdateMetadataDocument,
  type UpdateMetadataMutation,
  type UpdateMetadataMutationVariables,
} from "@dashboard/graphql";
import introspectionQueryResultData from "@dashboard/graphql/fragmentTypes.generated";
import { allPermissions } from "@dashboard/hooks/makeQuery";
import { ThemeProvider } from "@saleor/macaw-ui-next";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { IntlProvider } from "react-intl";

import { createMenuMetadata, createMenuWithMetadata, menuMetadataMenuId } from "./fixtures";
import { MenuMetadataDialog } from "./MenuMetadataDialog";

type MenuMetadataMock = MockedResponse<MenuMetadataQuery> & {
  result: jest.MockedFunction<() => { data: MenuMetadataQuery }>;
};

type UpdateMetadataMock = MockedResponse<UpdateMetadataMutation> & {
  result: jest.MockedFunction<() => { data: UpdateMetadataMutation }>;
};

// Generated query hooks send a PERMISSION_* variable for every permission.
const menuMetadataVariables: MenuMetadataQueryVariables = {
  id: menuMetadataMenuId,
  ...allPermissions,
};

const createMenuMetadataMock = (placement: string): MenuMetadataMock => ({
  request: { query: MenuMetadataDocument, variables: menuMetadataVariables },
  result: jest.fn(() => ({ data: createMenuMetadata(placement) })),
});

const createUpdateMetadataMock = (placement: string): UpdateMetadataMock => {
  const variables: UpdateMetadataMutationVariables = {
    id: menuMetadataMenuId,
    // Only the edited entry is sent; the untouched "nav.maxDepth" keeps whatever value it has now.
    input: [{ key: "nav.placement", value: placement }],
    keysToDelete: [],
  };
  const savedMenu = createMenuWithMetadata(placement);
  const data: UpdateMetadataMutation = {
    __typename: "Mutation",
    updateMetadata: { __typename: "UpdateMetadata", errors: [], item: savedMenu },
    deleteMetadata: { __typename: "DeleteMetadata", errors: [], item: savedMenu },
  };

  return {
    request: { query: UpdateMetadataDocument, variables },
    result: jest.fn(() => ({ data })),
  };
};

const renderDialog = ({
  open,
  mocks,
  onClose = jest.fn(),
}: {
  open: boolean;
  mocks: MockedResponse[];
  onClose?: () => void;
}): { setOpen: (open: boolean) => void } => {
  // possibleTypes lets the `...Metadata` fragment (on ObjectWithMetadata) match Menu,
  // like in the app's client.
  const cache = new InMemoryCache({ possibleTypes: introspectionQueryResultData.possibleTypes });
  const Wrapper = ({ children }: { children: ReactNode }): React.ReactNode => (
    <MockedProvider mocks={mocks} cache={cache}>
      <IntlProvider defaultLocale="en" locale="en">
        <ThemeProvider>{children}</ThemeProvider>
      </IntlProvider>
    </MockedProvider>
  );
  const { rerender } = render(
    <MenuMetadataDialog menuId={menuMetadataMenuId} open={open} onClose={onClose} />,
    { wrapper: Wrapper },
  );

  return {
    setOpen: nextOpen =>
      rerender(
        <MenuMetadataDialog menuId={menuMetadataMenuId} open={nextOpen} onClose={onClose} />,
      ),
  };
};

const metadataEditor = (isPrivate: boolean): HTMLElement => {
  const editor = screen
    .getAllByTestId("metadata-editor")
    .find(element => element.getAttribute("data-test-is-private") === String(isPrivate));

  if (!editor) {
    throw new Error(`No ${isPrivate ? "private" : "public"} metadata editor rendered`);
  }

  return editor;
};

const waitForLoadedEntries = async (): Promise<void> => {
  // Loading placeholders share the editors' test id; real editors have expand buttons.
  await waitFor(() => {
    expect(screen.queryByTestId("skeleton")).not.toBeInTheDocument();
    expect(screen.getAllByTestId("expand")).toHaveLength(2);
  });
  fireEvent.click(within(metadataEditor(false)).getByTestId("expand"));
  fireEvent.click(within(metadataEditor(true)).getByTestId("expand"));
};

describe("MenuMetadataDialog", () => {
  it("does not fetch structure metadata while closed", () => {
    // Arrange
    const mock = createMenuMetadataMock("header");

    // Act
    renderDialog({ open: false, mocks: [mock] });

    // Assert
    expect(screen.queryByText("Structure Metadata")).not.toBeInTheDocument();
    expect(mock.result).not.toHaveBeenCalled();
  });

  it("shows skeletons until the structure metadata loads, then the public and private entries", async () => {
    // Arrange
    const mock = createMenuMetadataMock("header");

    // Act
    renderDialog({ open: true, mocks: [mock] });

    // Assert
    expect(screen.getByText("Structure Metadata")).toBeInTheDocument();
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(0);
    expect(screen.getByTestId("save")).toBeDisabled();

    await waitForLoadedEntries();

    expect(mock.result).toHaveBeenCalledTimes(1);
    expect(within(metadataEditor(false)).getByDisplayValue("nav.placement")).toBeInTheDocument();
    expect(within(metadataEditor(false)).getByDisplayValue("header")).toBeInTheDocument();
    expect(within(metadataEditor(true)).getByDisplayValue("cms.sourceId")).toBeInTheDocument();
    expect(within(metadataEditor(true)).queryByDisplayValue("nav.placement")).toBeNull();
  });

  it("loads the latest metadata when reopened instead of showing what it loaded before", async () => {
    // Arrange
    const firstLoad = createMenuMetadataMock("header");
    const secondLoad = createMenuMetadataMock("footer");
    const { setOpen } = renderDialog({ open: true, mocks: [firstLoad, secondLoad] });

    await waitForLoadedEntries();
    setOpen(false);

    // Act
    setOpen(true);

    // Assert
    expect(screen.queryByDisplayValue("header")).not.toBeInTheDocument();
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(0);

    await waitForLoadedEntries();

    expect(secondLoad.result).toHaveBeenCalledTimes(1);
    expect(within(metadataEditor(false)).getByDisplayValue("footer")).toBeInTheDocument();
  });

  it("shows an error with Retry when the metadata fails to load, then the entries after a retry", async () => {
    // Arrange
    const failedLoad: MockedResponse<MenuMetadataQuery> = {
      request: { query: MenuMetadataDocument, variables: menuMetadataVariables },
      error: new Error("Failed to fetch"),
    };
    const retryLoad = createMenuMetadataMock("header");

    renderDialog({ open: true, mocks: [failedLoad, retryLoad] });

    expect(await screen.findByRole("alert")).toHaveTextContent("Couldn't load metadata");
    expect(screen.queryByTestId("metadata-editor")).not.toBeInTheDocument();
    expect(screen.getByTestId("save")).toBeDisabled();

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));

    // Assert
    await waitForLoadedEntries();

    expect(retryLoad.result).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(within(metadataEditor(false)).getByDisplayValue("header")).toBeInTheDocument();
  });

  it("saves an edited public value to this structure and closes without reloading anything", async () => {
    // Arrange
    const onClose = jest.fn();
    const load = createMenuMetadataMock("header");
    const updateMetadata = createUpdateMetadataMock("footer");
    const reload = createMenuMetadataMock("footer");

    renderDialog({ open: true, mocks: [load, updateMetadata, reload], onClose });
    await waitForLoadedEntries();

    // Act
    fireEvent.change(within(metadataEditor(false)).getByDisplayValue("header"), {
      target: { value: "footer" },
    });
    fireEvent.click(screen.getByTestId("save"));

    // Assert: the save's response updated the cached metadata, so nothing is requested again.
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
    expect(updateMetadata.result).toHaveBeenCalledTimes(1);
    expect(reload.result).not.toHaveBeenCalled();
  });
});
