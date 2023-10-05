import { filterLinesByNotYetRefunded } from "./utils";

const getMockLine = (lineId: string) => {
  return {
    id: lineId,
    __typename: "OrderLine",
    productName: "Foo",
    quantity: 1,
    quantityToFulfill: 0,
    thumbnail: null,
    variantName: "Foo variant 1",
    unitPrice: {
      __typename: "TaxedMoney",
      gross: {
        __typename: "Money",
        amount: 1,
        currency: "USD",
      },
    },
  } as const;
};

describe("OrderGrantRefundPage utils", () => {
  describe("getNotGrantedYetLinesIds", () => {
    it("Returns only line that doesnt exist in grantedRefunds", () => {
      const result = filterLinesByNotYetRefunded({
        lines: [
          getMockLine("granted 1"),
          getMockLine("granted 2"),
          getMockLine("granted 3"),
          getMockLine("not granted"),
        ],
        grantedRefunds: [
          /**
           * One refund is for 1 line
           */
          {
            __typename: "OrderGrantedRefund",
            lines: [
              {
                __typename: "OrderGrantedRefundLine",
                id: "a",
                orderLine: {
                  __typename: "OrderLine",
                  id: "granted 1",
                },
                reason: "",
              },
            ],
          },
          /**
           * One refund is for 2 lines
           */
          {
            __typename: "OrderGrantedRefund",
            lines: [
              {
                __typename: "OrderGrantedRefundLine",
                id: "a",
                orderLine: {
                  __typename: "OrderLine",
                  id: "granted 2",
                },
                reason: "",
              },
              {
                __typename: "OrderGrantedRefundLine",
                id: "a",
                orderLine: {
                  __typename: "OrderLine",
                  id: "granted 3",
                },
                reason: "",
              },
            ],
          },
        ],
      });

      expect(result).toEqual(["not granted"]);
    });
  });
});
