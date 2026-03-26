import { RuleTester } from "eslint";
import tsParser from "@typescript-eslint/parser";

import namedEffectsRule from "./named-effects.mjs";

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tsParser,
  },
});

ruleTester.run("named-effects", namedEffectsRule, {
  valid: [
    {
      code: `useEffect(function updateDocumentTitle() { document.title = count; }, [count]);`,
    },
    {
      code: `useEffect(myCallback, [dep]);`,
    },
    {
      code: `useEffect(function syncData() { fetch("/api"); }, []);`,
    },
  ],
  invalid: [
    {
      code: `useEffect(() => { document.title = count; }, [count]);`,
      errors: [{ messageId: "namedEffect" }],
    },
    {
      code: `useEffect(() => {}, []);`,
      errors: [{ messageId: "namedEffect" }],
    },
  ],
});
