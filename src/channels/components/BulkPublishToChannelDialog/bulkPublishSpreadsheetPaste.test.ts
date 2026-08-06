import {
  applySpreadsheetPasteToDrafts,
  parseSpreadsheetClipboard,
  sanitizeSpreadsheetInteger,
} from "./bulkPublishSpreadsheetPaste";
import { type ProductPublishDraft } from "./types";

const createDrafts = (count: number): ProductPublishDraft[] =>
  Array.from({ length: count }, (_, index) => ({
    productId: `p${index + 1}`,
    name: `Product ${index + 1}`,
    variantCount: 1,
    exceedsVariantLimit: false,
    hasManyVariants: false,
    hasCategory: true,
    alreadyInChannel: false,
    price: "",
    costPrice: "",
    stock: "",
  }));

describe("bulkPublishSpreadsheetPaste", () => {
  describe("parseSpreadsheetClipboard", () => {
    it("parses tab-separated rows from spreadsheet clipboard", () => {
      // Arrange & Act
      const grid = parseSpreadsheetClipboard("10.00\t5.00\t12\n20.00\t8.00\t24\r\n");

      // Assert
      expect(grid).toEqual([
        ["10.00", "5.00", "12"],
        ["20.00", "8.00", "24"],
      ]);
    });
  });

  describe("sanitizeSpreadsheetInteger", () => {
    it("truncates spreadsheet decimals for stock values", () => {
      // Arrange & Act & Assert
      expect(sanitizeSpreadsheetInteger("12.9")).toBe("12");
      expect(sanitizeSpreadsheetInteger("")).toBe("");
    });
  });

  describe("applySpreadsheetPasteToDrafts", () => {
    it("fills a column down from the focused field", () => {
      // Arrange
      const drafts = createDrafts(3);

      // Act
      const { drafts: nextDrafts, handled } = applySpreadsheetPasteToDrafts({
        drafts,
        startProductIndex: 0,
        startField: "price",
        pastedText: "10\n12\n15",
        showStock: true,
        currency: "USD",
      });

      // Assert
      expect(handled).toBe(true);
      expect(nextDrafts.map(draft => draft.price)).toEqual(["10.00", "12.00", "15.00"]);
    });

    it("maps a pasted row across price, cost price, and stock", () => {
      // Arrange
      const drafts = createDrafts(2);

      // Act
      const { drafts: nextDrafts, handled } = applySpreadsheetPasteToDrafts({
        drafts,
        startProductIndex: 0,
        startField: "price",
        pastedText: "10.00\t5.00\t12",
        showStock: true,
        currency: "USD",
      });

      // Assert
      expect(handled).toBe(true);
      expect(nextDrafts[0]).toMatchObject({
        price: "10.00",
        costPrice: "5.00",
        stock: "12",
      });
    });

    it("starts mapping from the focused column", () => {
      // Arrange
      const drafts = createDrafts(1);

      // Act
      const { drafts: nextDrafts, handled } = applySpreadsheetPasteToDrafts({
        drafts,
        startProductIndex: 0,
        startField: "costPrice",
        pastedText: "7.50\t20",
        showStock: true,
        currency: "USD",
      });

      // Assert
      expect(handled).toBe(true);
      expect(nextDrafts[0]).toMatchObject({
        costPrice: "7.50",
        stock: "20",
      });
    });

    it("ignores extra rows and invalid cells safely", () => {
      // Arrange
      const drafts = createDrafts(2);

      drafts[1].price = "5";

      // Act
      const { drafts: nextDrafts, handled } = applySpreadsheetPasteToDrafts({
        drafts,
        startProductIndex: 0,
        startField: "price",
        pastedText: "9.99\ninvalid",
        showStock: false,
        currency: "USD",
      });

      // Assert
      expect(handled).toBe(true);
      expect(nextDrafts[0].price).toBe("9.99");
      expect(nextDrafts[1].price).toBe("5");
    });

    it("trims trailing empty spreadsheet rows", () => {
      // Arrange
      const drafts = createDrafts(2);

      // Act
      const { drafts: nextDrafts, handled } = applySpreadsheetPasteToDrafts({
        drafts,
        startProductIndex: 0,
        startField: "price",
        pastedText: "10\n20\n\n",
        showStock: false,
        currency: "USD",
      });

      // Assert
      expect(handled).toBe(true);
      expect(nextDrafts.map(draft => draft.price)).toEqual(["10.00", "20.00"]);
    });

    it("returns handled false for empty clipboard data", () => {
      // Arrange
      const drafts = createDrafts(1);

      // Act
      const result = applySpreadsheetPasteToDrafts({
        drafts,
        startProductIndex: 0,
        startField: "price",
        pastedText: "   ",
        showStock: true,
        currency: "USD",
      });

      // Assert
      expect(result.handled).toBe(false);
    });
  });
});
