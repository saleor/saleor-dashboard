module.exports = {
  create: context => ({
    ImportDeclaration: node => {
      let iconImports = [];
      let messageId = "";
      let libraryName = "";

      // Check if importing from @saleor/macaw-ui-next
      if (node.source.value === "@saleor/macaw-ui-next") {
        iconImports = node.specifiers.filter(specifier => {
          return specifier.type === "ImportSpecifier" && specifier.imported.name.endsWith("Icon");
        });
        messageId = "noMacawUiIcons";
        libraryName = "@saleor/macaw-ui-next";
      }
      // Check if importing from @material-ui/icons
      else if (
        node.source.value === "@material-ui/icons" ||
        node.source.value.startsWith("@material-ui/icons/")
      ) {
        // For @material-ui/icons, all imports are icons
        iconImports = node.specifiers.filter(
          specifier =>
            specifier.type === "ImportSpecifier" || specifier.type === "ImportDefaultSpecifier",
        );
        messageId = "noMaterialUiIcons";
        libraryName = "@material-ui/icons";
      }

      if (iconImports.length > 0) {
        const iconNames = iconImports
          .map(spec =>
            spec.type === "ImportDefaultSpecifier" ? spec.local.name : spec.imported.name,
          )
          .join(", ");

        context.report({
          node,
          messageId,
          data: {
            icons: iconNames,
            library: libraryName,
          },
        });
      }
    },
  }),
  meta: {
    type: "suggestion",
    docs: {
      description: "Warn when importing icons from deprecated UI libraries",
      category: "Best Practices",
    },
    messages: {
      noMacawUiIcons:
        "Avoid importing icons ({{icons}}) from @saleor/macaw-ui-next. Use lucide-react instead.",
      noMaterialUiIcons:
        "Avoid importing icons ({{icons}}) from @material-ui/icons. Use lucide-react instead.",
    },
    schema: [],
  },
};
