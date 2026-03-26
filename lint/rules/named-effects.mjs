export default {
  create: context => ({
    CallExpression: node => {
      const callee = node.callee;
      const isDirectUseEffect = callee.type === "Identifier" && callee.name === "useEffect";
      const isMemberUseEffect =
        callee.type === "MemberExpression" &&
        !callee.computed &&
        callee.property &&
        callee.property.type === "Identifier" &&
        callee.property.name === "useEffect";

      if ((isDirectUseEffect || isMemberUseEffect) && node.arguments.length > 0) {
        const callback = node.arguments[0];

        if (callback.type === "ArrowFunctionExpression") {
          context.report({
            node: callback,
            messageId: "namedEffect",
          });
        }

        if (callback.type === "FunctionExpression" && !callback.id) {
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
