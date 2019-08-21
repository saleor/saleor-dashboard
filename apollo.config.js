module.exports = {
  client: {
    addTypename: true,
    includes: ["src/**/*.ts", "src/**/*.tsx"],
    name: "dashboard",
    service: {
      localSchemaFile: "schema.graphql",
      name: "saleor"
    }
  }
};
