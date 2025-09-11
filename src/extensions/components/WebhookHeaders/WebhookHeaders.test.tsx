import useForm from "@dashboard/hooks/useForm";
import Wrapper from "@test/wrapper";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { customHeaders } from "./utils.test";
import WebhookHeaders, { WebhookHeadersProps } from "./WebhookHeaders";

export const props: WebhookHeadersProps = {
  data: {
    syncEvents: [],
    asyncEvents: [],
    isActive: true,
    name: "Test webhook",
    targetUrl: "http://localhost:3000",
    subscriptionQuery: "",
    customHeaders,
  },
  onChange: () => undefined,
};

const Component = () => {
  const { change, data } = useForm(props.data, jest.fn());

  return (
    <Wrapper>
      <WebhookHeaders data={data} onChange={change} />
    </Wrapper>
  );
};
const getExpandIcon = () => screen.getByTestId("expand");

describe("WebhookHeaders", () => {
  it("is available on the webhook page", async () => {
    // Arrange
    render(<Component />);
    // Assert
    expect(screen.queryByTestId("webhook-headers-editor")).toBeInTheDocument();
  });
  it("can expand field", async () => {
    // Arrange
    render(<Component />);

    const user = userEvent.setup();
    const isExpandedAttribute = "data-test-expanded";
    const editor = screen.getByTestId("webhook-headers-editor");

    // Assert
    expect(editor).toHaveAttribute(isExpandedAttribute, "true");
    // Act
    await act(async () => {
      await user.click(getExpandIcon());
    });
    // Assert
    expect(editor).toHaveAttribute(isExpandedAttribute, "false");
  });
});
