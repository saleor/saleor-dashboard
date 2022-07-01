import {
  add,
  addAtIndex,
  isSelected,
  move,
  remove,
  removeAtIndex,
  toggle,
  update,
  updateAtIndex,
} from "./lists";

const initialArray = ["lorem", "ipsum", "dolor"];
const compare = (a, b) => a === b;

describe("Properly calculates output arrays", () => {
  it("Adds", () => {
    expect(add("sit", initialArray)).toMatchSnapshot();
  });

  it("Adds at index", () => {
    expect(addAtIndex("sit", initialArray, 2)).toMatchSnapshot();
  });

  it("Updates", () => {
    expect(
      update(
        {
          name: "amet",
          value: 32,
        },
        initialArray.map((el, index) => ({
          name: el,
          value: index,
        })),
        (a, b) => a.name === b.name,
      ),
    ).toMatchSnapshot();
  });

  it("Updates at index", () => {
    expect(updateAtIndex("amet", initialArray, 1)).toMatchSnapshot();
  });

  it("Removes", () => {
    expect(remove("ipsum", initialArray, compare)).toMatchSnapshot();
  });

  it("Removes at index", () => {
    expect(removeAtIndex(initialArray, 1)).toMatchSnapshot();
  });

  it("Matches", () => {
    expect(isSelected("lorem", initialArray, compare)).toBe(true);
    expect(isSelected("sit", initialArray, compare)).toBe(false);
  });

  it("Toggles", () => {
    expect(toggle("lorem", initialArray, compare)).toMatchSnapshot();
    expect(toggle("sit", initialArray, compare)).toMatchSnapshot();
  });

  it("Moves", () => {
    expect(move("lorem", initialArray, compare, 1)).toMatchSnapshot();
  });
});
