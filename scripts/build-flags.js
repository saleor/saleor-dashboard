const marked = require("marked");
const fs = require("fs");
const path = require("path");
const fm = require("front-matter");
const HtmlToReactParser = require("html-to-react").Parser;
const htmlToReactParser = new HtmlToReactParser();
const ReactDOMServer = require("react-dom/server");

const imageImports = [];

const generateImageComponentName = () => {
  const letter = String.fromCharCode(Math.floor(Math.random() * 26 + 97)).toUpperCase();
  const name = String(Math.random()).substring(2, 7);

  return `${letter}${name}`;
};

const renderer = {
  image(href, _, text) {
    const componentName = generateImageComponentName();
    imageImports.push({ componentName, href });

    return `<img src=${componentName} alt="${text}"/>`;
  },
};

marked.use({ renderer });

const mdParsed = fs
  .readdirSync(path.resolve(__dirname, "./../.featureFlags"))
  .filter(f => f.endsWith(".md"))
  .map(file => fs.readFileSync(path.resolve(__dirname, "./../.featureFlags/", file)))
  .map(binary => binary.toString())
  .map(fm)
  .map(({ body, attributes }) => ({
    component: htmlToReactParser.parse(marked.parse(body)),
    attributes,
  }))
  .map(({ component, attributes }) => ({
    component: ReactDOMServer.renderToStaticMarkup(component),
    ...attributes,
  }));

const availableFilters = mdParsed
  .reduce((prev, content) => prev.concat(content), [])
  .map(
    el =>
      `{
  name: "${el.name}",
  displayName: "${el.displayName}",
  component: ${el.name},
  visible: ${el.visible},
  content: {
    enabled: ${el.enabled},
    payload: "${el.payload}",
  }
}`,
  );

const componentsAsTemplate = mdParsed.reduce(
  (prev, { name, component }) => `${prev}\nconst ${name} = () => (<>${component}</>)`,
  "",
);

const components = imageImports.reduce((p, c) => {
  return p.replace(`"${c.componentName}"`, `{${c.componentName}}`);
}, componentsAsTemplate);

const imports = imageImports.reduce(
  (p, c) => `${p}\nimport ${c.componentName} from "${c.href}"`,
  "",
);

const template = `// @ts-nocheck
${imports}
${components}

export const AVAILABLE_FLAGS = [${availableFilters}] as const;
`;

fs.writeFileSync(path.resolve(__dirname, "./../.featureFlags/generated.tsx"), template);
