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
});
