import { SearchIcon } from "../Icons";
import { ButtonProps } from "./Button";
import { isFixedWidth } from "./utils";

describe("isFixedWidth", () => {
  it("Returns true when only icon is provided with no children", () => {
    // Arrange
    const props: ButtonProps = { icon: <SearchIcon /> };

    // Act
    const result = isFixedWidth(props);

    // Assert
    expect(result).toBe(true);
  });

  it("Returns false when children are provided, regardless of icon", () => {
    // Arrange
    const propsWithIcon: ButtonProps = {
      icon: <SearchIcon />,
      children: "Search",
    };
    const propsWithoutIcon: ButtonProps = { children: "Submit" };

    // Act
    const resultWithIcon = isFixedWidth(propsWithIcon);
    const resultWithoutIcon = isFixedWidth(propsWithoutIcon);

    // Assert
    expect(resultWithIcon).toBe(false);
    expect(resultWithoutIcon).toBe(false);
  }),
    it("Returns isFixedWidth prop when it's provided", () => {
      // Arrange
      const propsIconChildren: ButtonProps = {
        icon: <SearchIcon />,
        children: "Search",
        fixedWidth: true,
      };
      const propsIcon: ButtonProps = {
        icon: <SearchIcon />,
        fixedWidth: false,
      };

      // Act
      const resultIconChildren = isFixedWidth(propsIconChildren);
      const resultIcon = isFixedWidth(propsIcon);

      // Assert
      expect(resultIconChildren).toBe(true);
      expect(resultIcon).toBe(false);
    });
});
