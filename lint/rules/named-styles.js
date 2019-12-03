module.exports = {
  create: context => ({
    CallExpression: (codePath, node) => {
      if (
        ["makeStyles", "withStyles"].includes(codePath.callee.name) &&
        codePath.arguments.length < 2
      ) {
        context.report({
          loc: codePath.callee.loc,
          messageId:
            codePath.callee.name === "makeStyles"
              ? "expectedNameHook"
              : "expectedNameHoc",
          node
        });
      }
    }
  }),
  meta: {
    messages: {
      expectedNameHoc: 'withStyles hook should have "name" property.',
      expectedNameHook: 'makeStyles hook should have "name" property.'
    },
    type: "problem"
  }
};
