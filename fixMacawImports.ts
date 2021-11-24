import { API, FileInfo } from "jscodeshift";

const names = ["Button", "IconButton"];

function getButtonVariant(value: string): string {
  const map = {
    contained: "primary",
    outlined: "secondary",
    text: "tertiary"
  };

  return map[value] ?? value;
}

export default (fileInfo: FileInfo, api: API) => {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  root
    .find(j.ImportDeclaration, {
      source: {
        value: "@material-ui/core"
      }
    })
    .find(j.ImportSpecifier)
    .filter(importSpecifier =>
      names.includes(importSpecifier.value.imported.name)
    )
    .forEach(importSpecifier => {
      const macawImportDeclaration = root.find(j.ImportDeclaration, {
        source: {
          value: "@saleor/macaw-ui"
        }
      });

      const newIdentifier = j.importSpecifier({
        name: importSpecifier.value.imported.name,
        type: "Identifier"
      });

      if (macawImportDeclaration.length) {
        macawImportDeclaration
          .find(j.ImportSpecifier)
          .at(0)
          .insertAfter(newIdentifier);
      } else {
        root
          .find(j.ImportDeclaration)
          .at(0)
          .insertBefore(
            j.importDeclaration(
              [newIdentifier],
              {
                type: "Literal",
                value: "@saleor/macaw-ui"
              },
              "value"
            )
          );
      }
    })
    .remove();

  root
    .find(j.JSXElement, {
      openingElement: {
        type: "JSXOpeningElement",
        name: {
          type: "JSXIdentifier",
          name: "Button"
        }
      }
    })
    .find(j.JSXAttribute)
    .filter(attribute => attribute.value.name.name === "variant")
    .forEach(attribute => {
      if (attribute.value.value.type === "StringLiteral") {
        attribute.value.value.value = getButtonVariant(
          attribute.value.value.value
        );
      }
    });

  root
    .find(j.JSXElement, {
      openingElement: {
        type: "JSXOpeningElement",
        name: {
          type: "JSXIdentifier",
          name: "ConfirmButton"
        }
      }
    })
    .find(j.JSXAttribute)
    .filter(attribute => attribute.value.name.name === "variant")
    .forEach(attribute => {
      if (attribute.value.value.type === "StringLiteral") {
        attribute.value.value.value = getButtonVariant(
          attribute.value.value.value
        );
      }
    });

  root
    .find(j.JSXElement, {
      openingElement: {
        type: "JSXOpeningElement",
        name: {
          type: "JSXIdentifier",
          name: "IconButton"
        }
      }
    })
    .find(j.JSXAttribute)
    .at(0)
    .insertBefore(
      j.jsxAttribute(j.jsxIdentifier("variant"), j.stringLiteral("secondary"))
    );

  root
    .find(j.JSXElement, {
      openingElement: {
        type: "JSXOpeningElement",
        name: {
          type: "JSXIdentifier",
          name: "Button"
        }
      }
    })
    .find(j.JSXAttribute)
    .filter(
      attribute =>
        attribute.value.name.name === "color" &&
        attribute.value.value.type === "StringLiteral" &&
        attribute.value.value.value === "primary"
    )
    .remove();

  return root.toSource();
};
