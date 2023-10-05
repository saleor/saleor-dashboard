import { wasOrderLineReturned } from "./utils";

const mockGrantedRefunds: OrderDetailsGrantRefundFragment["grantedRefunds"] = [
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
] as const;

describe("OrderGrantRefundPage utils", () => {
  describe("getNotGrantedYetLinesIds", () => {
    it("Returns true if line was already in granted refund", () => {
      const result = wasOrderLineReturned(
        {
          id: "granted 1",
        },
        mockGrantedRefunds,
      );

      expect(result).toBe(true);
    }); 
    
    it("Returns false, if line was not found in granted refund", () => {
      const result = wasOrderLineReturned(
        {
          id: "aa-bb",
        },
        mockGrantedRefunds,
      );

      expect(result).toBe(false);
    });
  });
});
