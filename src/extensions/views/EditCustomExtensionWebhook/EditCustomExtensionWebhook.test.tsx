import {
  useWebhookDetailsQuery,
  useWebhookUpdateMutation,
  WebhookEventTypeAsyncEnum,
} from "@dashboard/graphql";
import { render, screen } from "@testing-library/react";

import { type WebhookFormData } from "../../components/WebhookDetailsPage/WebhookDetailsPage";
import { EditCustomExtensionWebhook } from "./EditCustomExtensionWebhook";

const mockWebhookDetailsPage = jest.fn();

jest.mock("@dashboard/graphql", () => ({
  ...(jest.requireActual("@dashboard/graphql") as object),
  useWebhookDetailsQuery: jest.fn(),
  useWebhookUpdateMutation: jest.fn(),
}));

jest.mock("@dashboard/hooks/useNotifier", () => ({
  useNotifier: () => jest.fn(),
}));

jest.mock("../../hooks/useAvailableEvents", () => ({
  useAvailableEvents: () => [],
}));

jest.mock("@dashboard/components/NotFoundPage", () => ({
  __esModule: true,
  default: () => <div data-test-id="not-found-page" />,
}));

jest.mock("../../components/WebhookDetailsPage/WebhookDetailsPage", () => ({
  WebhookDetailsPage: (props: unknown) => {
    mockWebhookDetailsPage(props);

    return <div data-test-id="webhook-details-page" />;
  },
}));

describe("EditCustomExtensionWebhook", () => {
  const webhookId = "webhook-1";
  const mockWebhookUpdate = jest.fn();

  const formData: WebhookFormData = {
    syncEvents: [],
    asyncEvents: [WebhookEventTypeAsyncEnum.ORDER_CREATED],
    isActive: true,
    name: "Test webhook",
    secretKey: "secret",
    targetUrl: "https://example.com/webhook",
    subscriptionQuery: "subscription { event { ... on OrderCreated { order { id } } } }",
    customHeaders: '{"x-custom-header":"value"}',
  };

  const submitForm = async (data: WebhookFormData) => {
    render(<EditCustomExtensionWebhook id={webhookId} />);

    const { onSubmit } = mockWebhookDetailsPage.mock.calls[0][0];

    await onSubmit(data);
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useWebhookDetailsQuery as jest.Mock).mockReturnValue({
      data: {
        webhook: {
          id: webhookId,
          name: "Test webhook",
          app: { id: "app-1", name: "Test app" },
        },
      },
      loading: false,
    });
    mockWebhookUpdate.mockResolvedValue({
      data: { webhookUpdate: { errors: [], webhook: { id: webhookId } } },
    });
    (useWebhookUpdateMutation as jest.Mock).mockReturnValue([
      mockWebhookUpdate,
      { data: undefined, status: "default" },
    ]);
  });

  it("renders not found page when webhook does not exist", () => {
    // Arrange
    (useWebhookDetailsQuery as jest.Mock).mockReturnValue({ data: undefined, loading: false });

    // Act
    render(<EditCustomExtensionWebhook id={webhookId} />);

    // Assert
    expect(screen.getByTestId("not-found-page")).toBeInTheDocument();
    expect(screen.queryByTestId("webhook-details-page")).not.toBeInTheDocument();
  });

  it("passes all form data, including custom headers, to the update mutation", async () => {
    // Arrange & Act
    await submitForm(formData);

    // Assert
    expect(mockWebhookUpdate).toHaveBeenCalledWith({
      variables: {
        id: webhookId,
        input: {
          syncEvents: formData.syncEvents,
          asyncEvents: formData.asyncEvents,
          isActive: formData.isActive,
          name: formData.name,
          secretKey: formData.secretKey,
          targetUrl: formData.targetUrl,
          query: formData.subscriptionQuery,
          customHeaders: formData.customHeaders,
        },
      },
    });
  });

  it("collapses async events to ANY_EVENTS when it is selected", async () => {
    // Arrange & Act
    await submitForm({
      ...formData,
      asyncEvents: [WebhookEventTypeAsyncEnum.ORDER_CREATED, WebhookEventTypeAsyncEnum.ANY_EVENTS],
    });

    // Assert
    expect(mockWebhookUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: expect.objectContaining({
          input: expect.objectContaining({
            asyncEvents: [WebhookEventTypeAsyncEnum.ANY_EVENTS],
          }),
        }),
      }),
    );
  });
});
