import { getDescriptionValue } from "./datagrid";

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
  it("should return empty string when description contains &nbsp", () => {
    expect(
      getDescriptionValue(
        '{"time": 1637142885936, "blocks": [{"data": {"text": "&nbsp;"}, "type": "paragraph"}], "version": "2.20.0"}',
      ),
    ).toBe("");
  });
});
