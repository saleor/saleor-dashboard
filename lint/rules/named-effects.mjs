export default {
  create: context => ({
    CallExpression: node => {
      if (node.callee.name === "useEffect" && node.arguments.length > 0) {
        const callback = node.arguments[0];

        if (callback.type === "ArrowFunctionExpression") {
          context.report({
            node: callback,
            messageId: "namedEffect",
          });
        }
      }
    },
  }),
  meta: {
    messages: {
      namedEffect:
        "useEffect callback should be a named function expression or a reference. Replace arrow function with `useEffect(function descriptiveName() { ... })`.",
    },
    type: "problem",
    docs: {
      description:
        "Enforce named function expressions in useEffect to improve readability and stack traces",
    },
  },
};
