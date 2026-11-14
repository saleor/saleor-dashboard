import { InMemoryCache } from "@apollo/client";
import { MockedProvider, type MockedResponse } from "@apollo/client/testing";
import { PromotionMetadataDocument, type PromotionMetadataQuery } from "@dashboard/graphql";
import introspectionQueryResultData from "@dashboard/graphql/fragmentTypes.generated";
import { allPermissions } from "@dashboard/hooks/makeQuery";
import { ThemeProvider } from "@saleor/macaw-ui-next";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { IntlProvider } from "react-intl";

import { createPromotionMetadata, promotionId } from "./fixtures";
import { PromotionMetadataDialog } from "./PromotionMetadataDialog";

type PromotionMetadataMock = MockedResponse<PromotionMetadataQuery> & {
  result: jest.Mock<{ data: PromotionMetadataQuery }>;
};

// Generated query hooks send a PERMISSION_* variable for every permission.
const request = {
  query: PromotionMetadataDocument,
  variables: { id: promotionId, ...allPermissions },
};

const createPromotionMetadataMock = (campaignCode: string): PromotionMetadataMock => ({
  request,
  result: jest.fn(() => ({ data: createPromotionMetadata(campaignCode) })),
});

const renderDialog = ({
  open,
  mocks,
}: {
  open: boolean;
  mocks: Array<MockedResponse<PromotionMetadataQuery>>;
}): { setOpen: (open: boolean) => void } => {
  // possibleTypes lets the `...Metadata` fragment (on ObjectWithMetadata) match Promotion,
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
    <PromotionMetadataDialog open={open} onClose={jest.fn()} promotionId={promotionId} />,
    { wrapper: Wrapper },
  );

  return {
    setOpen: nextOpen =>
      rerender(
        <PromotionMetadataDialog open={nextOpen} onClose={jest.fn()} promotionId={promotionId} />,
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

describe("PromotionMetadataDialog", () => {
  it("does not fetch promotion metadata while closed", () => {
    // Arrange
    const mock = createPromotionMetadataMock("SUMMER26");

    // Act
    renderDialog({ open: false, mocks: [mock] });

    // Assert
    expect(screen.queryByText("Promotion Metadata")).not.toBeInTheDocument();
    expect(mock.result).not.toHaveBeenCalled();
  });

  it("shows skeletons until the promotion metadata loads, then the public and private entries", async () => {
    // Arrange
    const mock = createPromotionMetadataMock("SUMMER26");

    // Act
    renderDialog({ open: true, mocks: [mock] });

    // Assert
    expect(screen.getByText("Promotion Metadata")).toBeInTheDocument();
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(0);

    await waitForLoadedEntries();

    expect(mock.result).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(within(metadataEditor(false)).getByDisplayValue("campaign.code")).toBeInTheDocument();
    expect(within(metadataEditor(false)).getByDisplayValue("SUMMER26")).toBeInTheDocument();
    expect(within(metadataEditor(true)).getByDisplayValue("budget.owner")).toBeInTheDocument();
    expect(within(metadataEditor(true)).queryByDisplayValue("campaign.code")).toBeNull();
  });

  it("loads the latest metadata when reopened instead of showing what it loaded before", async () => {
    // Arrange
    const firstLoad = createPromotionMetadataMock("SUMMER26");
    const secondLoad = createPromotionMetadataMock("AUTUMN26");
    const { setOpen } = renderDialog({ open: true, mocks: [firstLoad, secondLoad] });

    await waitForLoadedEntries();
    setOpen(false);

    // Act
    setOpen(true);

    // Assert
    expect(screen.queryByDisplayValue("SUMMER26")).not.toBeInTheDocument();
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(0);

    await waitForLoadedEntries();

    expect(secondLoad.result).toHaveBeenCalledTimes(1);
    expect(within(metadataEditor(false)).getByDisplayValue("AUTUMN26")).toBeInTheDocument();
  });

  it("shows an error with Retry when the metadata fails to load, then the entries after a retry", async () => {
    // Arrange
    const failedLoad: MockedResponse<PromotionMetadataQuery> = {
      request,
      error: new Error("Failed to fetch"),
    };
    const retryLoad = createPromotionMetadataMock("SUMMER26");

    renderDialog({ open: true, mocks: [failedLoad, retryLoad] });

    expect(await screen.findByRole("alert")).toHaveTextContent("Couldn't load metadata");
    expect(screen.queryByTestId("skeleton")).not.toBeInTheDocument();
    expect(screen.queryByTestId("metadata-editor")).not.toBeInTheDocument();

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));

    // Assert
    await waitForLoadedEntries();

    expect(retryLoad.result).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(within(metadataEditor(false)).getByDisplayValue("SUMMER26")).toBeInTheDocument();
  });

  it("shows the load error instead of skeletons when the promotion no longer exists", async () => {
    // Arrange
    const missingPromotion: MockedResponse<PromotionMetadataQuery> = {
      request,
      result: { data: { __typename: "Query", promotion: null } },
    };

    // Act
    renderDialog({ open: true, mocks: [missingPromotion] });

    // Assert
    expect(await screen.findByRole("alert")).toHaveTextContent("Couldn't load metadata");
    expect(screen.queryByTestId("skeleton")).not.toBeInTheDocument();
    expect(screen.queryByTestId("metadata-editor")).not.toBeInTheDocument();
  });
});
