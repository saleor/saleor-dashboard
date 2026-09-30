import { hasPermission } from "@dashboard/auth/misc";
import { ProductMediaType } from "@dashboard/graphql";
import { isMainSchema } from "@dashboard/graphql/schemaVersion";
import { productMediaUrl } from "@dashboard/translations/urls";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type ComponentProps } from "react";
import { MemoryRouter } from "react-router-dom";

import ProductMediaPage from "./ProductMediaPage";

const mockNavigate = jest.fn();

jest.mock("@dashboard/auth/misc", () => ({
  hasPermission: jest.fn(),
}));
jest.mock("@dashboard/auth/useUser", () => ({
  useUser: () => ({ user: { id: "user-id" } }),
}));
jest.mock("@dashboard/components/Savebar");
jest.mock("@dashboard/graphql/schemaVersion", () => ({
  isMainSchema: jest.fn(() => true),
}));
jest.mock("@dashboard/hooks/useNavigator", () => ({
  __esModule: true,
  default: () => mockNavigate,
}));
jest.mock("@dashboard/translations/useCachedLocales", () => ({
  useCachedLocales: () => ({ lastUsedLocaleOrFallback: "DE" }),
}));

const mockHasPermission = hasPermission as jest.MockedFunction<typeof hasPermission>;
const mockIsMainSchema = isMainSchema as jest.MockedFunction<typeof isMainSchema>;

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

const mediaFixture: NonNullable<ComponentProps<typeof ProductMediaPage>["mediaObj"]> = {
  id: "media-id",
  alt: "Front view",
  url: "https://example.com/front.jpg",
  type: ProductMediaType.IMAGE,
  oembedData: "{}",
};

const defaultProps: ComponentProps<typeof ProductMediaPage> = {
  productId: "product-id",
  mediaObj: mediaFixture,
  media: [{ id: mediaFixture.id, url: mediaFixture.url }],
  disabled: false,
  product: "Test product",
  saveButtonBarState: "default",
  onDelete: jest.fn(),
  onRowClick: jest.fn(() => jest.fn()),
  onShowMetadata: jest.fn(),
  onSubmit: jest.fn(),
};

const renderPage = () =>
  render(
    <Wrapper>
      <MemoryRouter>
        <ProductMediaPage {...defaultProps} />
      </MemoryRouter>
    </Wrapper>,
  );

describe("ProductMediaPage translations action", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockHasPermission.mockReset();
    mockIsMainSchema.mockReset();
    mockHasPermission.mockReturnValue(true);
    mockIsMainSchema.mockReturnValue(true);
  });

  it("opens translation for the current media in the last used locale", async () => {
    // Arrange
    const user = userEvent.setup();

    renderPage();

    // Act
    await user.click(screen.getByTitle("Open translations"));

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith(
      productMediaUrl("DE", defaultProps.productId, mediaFixture.id),
    );
  });

  it("hides the translations action without translation permission", () => {
    // Arrange
    mockHasPermission.mockReturnValue(false);

    // Act
    renderPage();

    // Assert
    expect(screen.queryByTitle("Open translations")).not.toBeInTheDocument();
  });

  it("hides the translations action when media translations are unavailable", () => {
    // Arrange
    mockIsMainSchema.mockReturnValue(false);

    // Act
    renderPage();

    // Assert
    expect(screen.queryByTitle("Open translations")).not.toBeInTheDocument();
  });
});
