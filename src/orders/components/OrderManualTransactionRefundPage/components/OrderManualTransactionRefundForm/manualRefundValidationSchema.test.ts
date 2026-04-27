import { TransactionActionEnum, type TransactionItemFragment } from "@dashboard/graphql";
import { createIntl } from "react-intl";

import { getValidationSchema } from "./manualRefundValidationSchema";

describe("getValidationSchema", () => {
  const intl = createIntl({
    locale: "en",
    defaultLocale: "en",
    messages: {},
  });

  const transactions = [
    {
      id: "t1",
      chargedAmount: { amount: 100, __typename: "Money" as const },
      actions: [TransactionActionEnum.REFUND],
    },
  ] as unknown as TransactionItemFragment[];

  const baseInput = {
    transationId: "t1",
    reason: "",
    reasonReferenceId: "",
  };

  it("treats cleared amount (undefined) as missing with a clear message, not NaN", () => {
    const schema = getValidationSchema(intl, transactions);
    const result = schema.safeParse({
      ...baseInput,
      amount: undefined,
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      const amountIssue = result.error.flatten().fieldErrors.amount?.[0];

      expect(amountIssue).toBeDefined();
      expect(amountIssue?.toLowerCase()).not.toContain("nan");
    }
  });

  it("treats NaN amount as missing with a clear message", () => {
    const schema = getValidationSchema(intl, transactions);
    const result = schema.safeParse({
      ...baseInput,
      amount: Number.NaN,
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      const amountIssue = result.error.flatten().fieldErrors.amount?.[0];

      expect(amountIssue).toBeDefined();
      expect(amountIssue?.toLowerCase()).not.toContain("nan");
    }
  });

  it("accepts a positive finite amount", () => {
    const schema = getValidationSchema(intl, transactions);
    const result = schema.safeParse({
      ...baseInput,
      amount: 5,
    });

    expect(result.success).toBe(true);
  });
});
