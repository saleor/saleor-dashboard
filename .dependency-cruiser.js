/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "Macaw UI - migration",
      severity: "info",
      comment: "Macaw UI migration",
      from: {},
      to: {
        path: "@saleor/macaw-ui",
      },
    },
    {
      name: "Material UI - migration",
      severity: "info",
      comment: "Material UI migration",
      from: {},
      to: {
        path: "@material-ui/*",
      },
    },
  ],
  options: {
    doNotFollow: {
      path: "node_modules",
    },
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: "tsconfig.json",
    },
    enhancedResolveOptions: {
      exportsFields: ["exports"],
      conditionNames: ["import", "require", "node", "default"],
      mainFields: ["main", "types"],
    },
    reporterOptions: {
      dot: {
        collapsePattern: "node_modules/[^/]+",
        collapsePattern:
          "^(packages|src|lib|app|bin|test(s?)|spec(s?))/[^/]+|node_modules/[^/]+",
      },
      text: {
        highlightFocused: true,
      },
    },
  },
};
// generated: dependency-cruiser@12.10.0 on 2023-03-03T12:44:43.123Z
