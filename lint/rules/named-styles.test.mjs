import { RuleTester } from "eslint";
import tsParser from "@typescript-eslint/parser";

import namedStylesRule from "./named-styles.mjs";

const okCode =
  'const useStyles = makeStyles( \
    { \
      root: { \
        alignItems: "center", \
        display: "flex", \
        height: "100vh", \
        justifyContent: "center" \
      } \
    }, \
    { name: "LoginLoading" } \
);';

const badCode = `const useStyles = makeStyles(theme => ({
    fileField: {
      display: "none"
    },
    image: {
      height: "100%",
      objectFit: "contain",
      userSelect: "none",
      width: "100%"
    },
    imageContainer: {
      background: "#ffffff",
      border: "1px solid #eaeaea",
      borderRadius: theme.spacing(),
      height: 148,
      justifySelf: "start",
      overflow: "hidden",
      padding: theme.spacing(2),
      position: "relative",
      width: 148
    }
}));`;

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tsParser,
  },
});

ruleTester.run("named-styles", namedStylesRule, {
  invalid: [
    {
      code: badCode,
      output: badCode.replace("}));", '}),{ name: "<input>" });'),
      errors: [{ messageId: "expectedNameHook" }],
    },
  ],
  valid: [
    {
      code: okCode,
    },
  ],
});
