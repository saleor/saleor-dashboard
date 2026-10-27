import { ShopContext } from "@dashboard/components/Shop";
import { LanguageCodeEnum, type LanguageFragment, type ShopInfoQuery } from "@dashboard/graphql";
import { TranslationLocalesProvider } from "@dashboard/translations/useCachedLocales";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { LanguageSwitchWithCaching } from "./LanguageSwitch";

const languages: LanguageFragment[] = [
  { __typename: "LanguageDisplay", code: LanguageCodeEnum.DE, language: "German" },
  { __typename: "LanguageDisplay", code: LanguageCodeEnum.FR, language: "French" },
  { __typename: "LanguageDisplay", code: LanguageCodeEnum.PL, language: "Polish" },
];
const shop = { languages } as ShopInfoQuery["shop"];

const renderSwitch = (onLanguageChange = jest.fn()): ReturnType<typeof render> =>
  render(
    <Wrapper>
      <ShopContext.Provider value={shop}>
        <TranslationLocalesProvider>
          <LanguageSwitchWithCaching
            currentLanguage={LanguageCodeEnum.DE}
            languages={languages}
            onLanguageChange={onLanguageChange}
          />
        </TranslationLocalesProvider>
      </ShopContext.Provider>
    </Wrapper>,
  );

describe("LanguageSwitchWithCaching", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("lists recently used languages first", async () => {
    // Arrange
    const user = userEvent.setup();

    localStorage.setItem(
      "cachedTranslationLocales",
      JSON.stringify([LanguageCodeEnum.FR, LanguageCodeEnum.PL]),
    );
    renderSwitch();

    // Act
    await user.click(screen.getByRole("combobox"));

    // Assert
    const options = screen.getAllByRole("option").map(option => option.textContent);

    expect(options).toEqual(["Polish (PL)", "French (FR)", "German (DE)"]);
  });

  it("remembers a language chosen from the switch", async () => {
    // Arrange
    const user = userEvent.setup();
    const onLanguageChange = jest.fn();

    renderSwitch(onLanguageChange);

    // Act
    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: "Polish (PL)" }));

    // Assert
    expect(onLanguageChange).toHaveBeenCalledWith(LanguageCodeEnum.PL);
    expect(localStorage.getItem("cachedTranslationLocales")).toBe(
      JSON.stringify([LanguageCodeEnum.PL]),
    );
  });
});
