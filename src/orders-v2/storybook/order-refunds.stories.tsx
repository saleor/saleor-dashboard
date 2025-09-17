import { OrderGrantedRefundStatusEnum } from "@dashboard/graphql";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { OrderRefunds } from "../order-refunds/order-refunds";

const meta = {
  title: "Order Detail Page / Content / Refunds",
  component: OrderRefunds,
  decorators: [Story => <Story />],
  args: {
    onNewRefund: () => alert("New refund"),
    onEditRefund: (id: string) => alert(`Edit refund ${id}`),
  },
} satisfies Meta<typeof OrderRefunds>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    orderRefundState: "refundable",
    orderRefundsDisplayList: [
      {
        id: "1",
        createdAt: "2023-10-10T10:00:00Z",
        type: "manual",
        reasonNote: "Customer requested refund",
        reasonType: null,
        status: OrderGrantedRefundStatusEnum.SUCCESS,
        amount: {
          currency: "USD",
          amount: 100,
        },
        user: {
          email: "customer@example.com",
          firstName: "John",
          lastName: "Doe",
        },
      },
    ],
  },
};

export const Failure: Story = {
  args: {
    orderRefundState: "refundable",
    orderRefundsDisplayList: [
      {
        id: "1",
        createdAt: "2023-10-10T10:00:00Z",
        type: "manual",
        reasonNote: "Customer requested refund",
        reasonType: null,
        status: OrderGrantedRefundStatusEnum.FAILURE,
        amount: {
          currency: "USD",
          amount: 100.33,
        },
        user: {
          email: "customer@example.com",
          firstName: "John",
          lastName: "Doe",
        },
      },
    ],
  },
};

export const Pending: Story = {
  args: {
    orderRefundState: "refundable",
    orderRefundsDisplayList: [
      {
        id: "1",
        createdAt: "2023-10-10T10:00:00Z",
        type: "manual",
        reasonNote: null,
        reasonType: null,
        status: OrderGrantedRefundStatusEnum.PENDING,
        amount: {
          currency: "USD",
          amount: 12.33,
        },
        user: {
          email: "customer@example.com",
          firstName: "John",
          lastName: "Doe",
        },
      },
    ],
  },
};

export const withGrantedRefunds: Story = {
  args: {
    orderRefundState: "refundable",
    orderRefundsDisplayList: [
      {
        id: "1",
        createdAt: "2023-10-10T10:00:00Z",
        type: "standard",
        reasonType: null,
        reasonNote:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        status: OrderGrantedRefundStatusEnum.SUCCESS,
        amount: {
          currency: "USD",
          amount: 100,
        },
        user: {
          email: "customer@example.com",
          firstName: "John",
          lastName: "Doe",
        },
      },
    ],
  },
};

export const withEditableRefund: Story = {
  args: {
    orderRefundState: "refundable",
    orderRefundsDisplayList: [
      {
        id: "1",
        createdAt: "2023-10-10T10:00:00Z",
        type: "standard",
        reasonType: null,
        reasonNote: "",
        status: OrderGrantedRefundStatusEnum.FAILURE,
        amount: {
          currency: "USD",
          amount: 100,
        },
        user: {
          email: "customer@example.com",
          firstName: "John",
          lastName: "Doe",
        },
      },
    ],
  },
};

export const WithMultipleRefunds: Story = {
  args: {
    orderRefundState: "refundable",
    orderRefundsDisplayList: [
      {
        id: "1",
        createdAt: "2023-10-10T10:00:00Z",
        type: "manual",
        reasonNote: "Customer requested refund",
        status: OrderGrantedRefundStatusEnum.SUCCESS,
        reasonType: null,
        amount: {
          currency: "USD",
          amount: 100,
        },
        user: {
          email: "customer@example.com",
          firstName: "John",
          lastName: "Doe",
        },
      },
      {
        id: "2",
        createdAt: "2023-10-11T10:00:00Z",
        type: "standard",
        reasonNote: "Granted refund for returned items",
        reasonType: null,
        status: OrderGrantedRefundStatusEnum.PENDING,
        amount: {
          currency: "USD",
          amount: 100,
        },
        user: null,
      },
    ],
  },
};

export const Empty: Story = {
  args: {
    orderRefundState: "noTransactionsToRefund",
    orderRefundsDisplayList: [],
  },
};
