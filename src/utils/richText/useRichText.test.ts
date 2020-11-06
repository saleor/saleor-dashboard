import { OutputData } from "@editorjs/editorjs";
import { renderHook } from "@testing-library/react-hooks";

import useRichText from "./useRichText";

type Fixtures = Record<"short" | "long", OutputData>;
const fixtures: Fixtures = {
  long: {
    blocks: [
      {
        data: {
          level: 1,
          text: "Some header"
        },
        type: "header"
      },
      {
        data: {
          text: "Some text"
        },
        type: "paragraph"
      }
    ]
  },
  short: {
    blocks: [
      {
        data: {
          text: "Some text"
        },
        type: "paragraph"
      }
    ]
  }
};

describe("useRichText", () => {
  it("properly saves data in form", () => {
    const triggerChange = jest.fn();
    const hook = renderHook(() =>
      useRichText({
        initial: null,
        triggerChange
      })
    );

    const [data, change] = hook.result.current;
    expect(data.current).toMatchObject({ blocks: [] });

    change(fixtures.short);

    expect(data.current).toMatchObject(fixtures.short);
    expect(triggerChange).toHaveBeenCalled();
  });

  it("properly updates data in form", () => {
    const triggerChange = jest.fn();
    const hook = renderHook(() =>
      useRichText({
        initial: JSON.stringify(fixtures.short),
        triggerChange
      })
    );

    const [data, change] = hook.result.current;
    expect(data.current).toMatchObject(fixtures.short);

    change(fixtures.long);

    expect(data.current).toMatchObject(fixtures.long);
    expect(triggerChange).toHaveBeenCalled();
  });
});
