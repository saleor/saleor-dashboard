import {
  useAppQuery,
  useWebhookCreateMutation,
  WebhookEventTypeAsyncEnum,
} from "@dashboard/graphql";
import { render, screen } from "@testing-library/react";

import { type WebhookFormData } from "../../components/WebhookDetailsPage/WebhookDetailsPage";
import { AddCustomExtensionWebhook } from "./AddCustomExtensionWebhook";

const mockWebhookDetailsPage = jest.fn();

jest.mock("@dashboard/graphql", () => ({
  ...(jest.requireActual("@dashboard/graphql") as object),
  useAppQuery: jest.fn(),
  useWebhookCreateMutation: jest.fn(),
}));

jest.mock("@dashboard/hooks/useNavigator", () => () => jest.fn());

jest.mock("@dashboard/hooks/useNotifier", () => ({
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

describe("AddCustomExtensionWebhook", () => {
  const appId = "app-1";
  const mockWebhookCreate = jest.fn();

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
    render(<AddCustomExtensionWebhook appId={appId} />);

    const { onSubmit } = mockWebhookDetailsPage.mock.calls[0][0];

    await onSubmit(data);
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useAppQuery as jest.Mock).mockReturnValue({
      data: { app: { id: appId, name: "Test app" } },
    });
    mockWebhookCreate.mockResolvedValue({
      data: { webhookCreate: { errors: [], webhook: { id: "webhook-1" } } },
    });
    (useWebhookCreateMutation as jest.Mock).mockReturnValue([
      mockWebhookCreate,
      { data: undefined, status: "default" },
    ]);
  });

  it("renders the webhook details page", () => {
    // Arrange & Act
    render(<AddCustomExtensionWebhook appId={appId} />);

    // Assert
    expect(screen.getByTestId("webhook-details-page")).toBeInTheDocument();
  });

  it("passes all form data, including custom headers, to the create mutation", async () => {
    // Arrange & Act
    await submitForm(formData);

    // Assert
    expect(mockWebhookCreate).toHaveBeenCalledWith({
      variables: {
        input: {
          app: appId,
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
    expect(mockWebhookCreate).toHaveBeenCalledWith(
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
