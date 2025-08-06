/* eslint-disable @typescript-eslint/no-var-requires */
const { RuleTester } = require("eslint");

const namedStylesRule = require("./named-styles");

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
  parser: require.resolve("@typescript-eslint/parser")
});

ruleTester.run("named-styles", namedStylesRule, {
  invalid: [
    {
      code: badCode,
      errors: [{ message: "makeStyles hook should be named." }]
    }
  ],
  valid: [
    {
      code: okCode
    }
  ]
});
