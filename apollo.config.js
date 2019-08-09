module.exports = {
  client: {
    addTypename: true,
    includes: ["src/**/*.ts", "src/**/*.tsx"],
    name: "dashboard",
    service: {
      endpoint: "localhost:8000/graphql/",
      name: "saleor"
    }
  }
};
