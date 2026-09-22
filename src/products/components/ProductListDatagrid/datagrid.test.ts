import { ProductListUrlSortField } from "@dashboard/products/urls";
import { testIntlInstance } from "@test/intl";

import { getDescriptionValue, productListStaticColumnAdapter } from "./datagrid";

describe("productListStaticColumnAdapter", () => {
  it("keeps merchandising columns compact and grows the product name", () => {
    // Arrange & Act
    const columns = productListStaticColumnAdapter({
      intl: testIntlInstance,
      sort: { sort: ProductListUrlSortField.name, asc: true },
      onPriceClick: undefined,
    });

    // Assert
    expect(
      columns.map(column => ({
        id: column.id,
        width: column.width,
        grow: column.grow,
      })),
    ).toEqual([
      { id: "name", width: 280, grow: 1 },
      { id: "productType", width: 160, grow: undefined },
      { id: "description", width: 240, grow: undefined },
      { id: "availability", width: 200, grow: undefined },
      { id: "date", width: 200, grow: undefined },
      { id: "created", width: 200, grow: undefined },
      { id: "price", width: 140, grow: undefined },
      { id: "productCategory", width: 180, grow: undefined },
      { id: "productCollections", width: 200, grow: undefined },
    ]);
  });
});

describe("getDescriptionValue", () => {
  it("should return description value", () => {
    expect(
      getDescriptionValue(
        '{"time": 1634014163888, "blocks": [{"data": {"text": "description"}, "type": "paragraph"}], "version": "2.20.0"}',
      ),
    ).toBe("description");
  });

  it("should return empty string when no description data", () => {
    expect(getDescriptionValue('{"blocks": [{"data": {}, "type": "paragraph"}]}')).toBe("");
  });

  it("should replace all &nbsp; with empty string", () => {
    expect(
      getDescriptionValue(
        '{"time": 1637142885936, "blocks": [{"data": {"text": "&nbsp;&nbsp;&nbsp;&nbsp;description&nbsp;&nbsp;"}, "type": "paragraph"}], "version": "2.20.0"}',
      ),
    ).toBe("description");
  });

  it("should replace all html tags with empty string", () => {
    expect(
      getDescriptionValue(
        '{"time": 1637142885936, "blocks": [{"data": {"text": "<b><a href=http://fooflw.pl>Link</a><i> description</i></b>"}, "type": "paragraph"}], "version": "2.20.0"}',
      ),
    ).toBe("Link description");
  });

  it("should omit blocks with empty text", () => {
    expect(
      getDescriptionValue(
        '{"time": 1634014163888, "blocks": [{"data": {"text": ""}, "type": "heading"},{"data": {"text": ""}, "type": "paragraph"},{"data": {"text": "description"}, "type": "paragraph"}], "version": "2.20.0"}',
      ),
    ).toBe("description");
  });

  it("should cut description when too long", () => {
    expect(
      getDescriptionValue(
        '{"time": 1634014163888, "blocks": [{"data": {"text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In tempus, nisi sed dapibus eleifend, nisl tellus tempor mi, tristique pretium."}, "type": "heading"},{"data": {"text": ""}, "type": "paragraph"},{"data": {"text": "description"}, "type": "paragraph"}], "version": "2.20.0"}',
      ),
    ).toBe(
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In tempus, nisi sed dapibus eleifend, nisl ...",
    );
  });
});
