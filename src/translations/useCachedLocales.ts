import { LanguageCodeEnum } from "@dashboard/graphql";
import useLocale from "@dashboard/hooks/useLocale";
import useLocalStorage from "@dashboard/hooks/useLocalStorage";

export class CachedLocalesStack {
  private members = new Set<LanguageCodeEnum>();

  private maxMembers = 10;

  constructor(init: LanguageCodeEnum[]) {
    this.members = new Set<LanguageCodeEnum>(init);
  }

  getMembers() {
    return Array.from(this.members);
  }

  appendMember(member: LanguageCodeEnum) {
    if (this.members.size >= this.maxMembers) {
      const asArr = Array.from(this.members);
      const firstItem = asArr[0];

      this.members.delete(firstItem);
      this.members.add(member);
    } else {
      // push to front - delete first so we can add it again
      if (this.members.has(member)) {
        this.members.delete(member);
      }

      this.members.add(member);
    }

    return this.members;
  }
}

export const useCachedLocales = () => {
  const { locale } = useLocale();
  const [cachedValues, setValues] = useLocalStorage<LanguageCodeEnum[]>(
    "cachedTranslationLocales",
    [],
  );

  const reversedValues = [...cachedValues].reverse();

  return {
    lastUsedLocaleOrFallback: reversedValues[0]?.toUpperCase() ?? locale.toUpperCase(),
    cachedValues: reversedValues,
    pushValue(code: LanguageCodeEnum) {
      setValues(current => {
        const stack = new CachedLocalesStack(current);

        stack.appendMember(code);

        return stack.getMembers();
      });
    },
  };
};
