import {
  useAppQuery,
  useWebhookCreateMutation,
  WebhookEventTypeAsyncEnum,
} from "@dashboard/graphql";
import { render } from "@testing-library/react";

import { type WebhookFormData } from "../../components/WebhookDetailsPage/WebhookDetailsPage";
import { AddCustomExtensionWebhook } from "./AddCustomExtensionWebhook";

const mockWebhookDetailsPage = jest.fn();

jest.mock("@dashboard/graphql/schemaVersion", () => ({
  isMainSchema: () => false,
  isStagingSchema: () => true,
}));

jest.mock("@dashboard/graphql", () => ({
  ...(jest.requireActual("@dashboard/graphql") as object),
  useAppQuery: jest.fn(),
  useWebhookCreateMutation: jest.fn(),
}));

jest.mock("@dashboard/hooks/useNavigator", () => () => jest.fn());

jest.mock("@dashboard/hooks/useNotifier/useNotifier", () => ({
  useNotifier: () => jest.fn(),
}));

jest.mock("../../hooks/useAvailableEvents", () => ({
  useAvailableEvents: () => [],
}));

jest.mock("../../components/WebhookDetailsPage/WebhookDetailsPage", () => ({
  WebhookDetailsPage: (props: unknown) => {
    mockWebhookDetailsPage(props);

    return <div data-test-id="webhook-details-page" />;
  },
}));

describe("AddCustomExtensionWebhook with staging schema", () => {
  const mockWebhookCreate = jest.fn();

  const formData: WebhookFormData = {
    syncEvents: [],
    asyncEvents: [WebhookEventTypeAsyncEnum.ORDER_CREATED],
    isActive: true,
    name: "Test webhook",
    secretKey: "secret",
    targetUrl: "https://example.com/webhook",
    subscriptionQuery: "subscription { event { ... on OrderCreated { order { id } } } }",
    customHeaders: "{}",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAppQuery as jest.Mock).mockReturnValue({ data: { app: { name: "Test app" } } });
    (useWebhookCreateMutation as jest.Mock).mockReturnValue([
      mockWebhookCreate.mockResolvedValue({ data: { webhookCreate: { errors: [] } } }),
      { status: "default", data: undefined },
    ]);
  });

  it("omits secretKey, removed from the API in 3.24", async () => {
    // Arrange
    render(<AddCustomExtensionWebhook appId="app-1" />);

    const { onSubmit } = mockWebhookDetailsPage.mock.calls[0][0];

    // Act
    await onSubmit(formData);

    // Assert
    expect(mockWebhookCreate).toHaveBeenCalledWith({
      variables: { input: expect.objectContaining({ secretKey: undefined }) },
    });
  });
});
