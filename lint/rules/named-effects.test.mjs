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
    {
      code: `React.useEffect(function updateTitle() { document.title = count; }, [count]);`,
    },
    {
      code: `React.useEffect(myCallback, [dep]);`,
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
    {
      code: `React.useEffect(() => { document.title = count; }, [count]);`,
      errors: [{ messageId: "namedEffect" }],
    },
    {
      code: `useEffect(function () { document.title = count; }, [count]);`,
      errors: [{ messageId: "namedEffect" }],
    },
    {
      code: `React.useEffect(function () { fetch("/api"); }, []);`,
      errors: [{ messageId: "namedEffect" }],
    },
  ],
});
