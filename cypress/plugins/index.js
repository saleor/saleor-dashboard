// / <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */

/* eslint-disable @typescript-eslint/no-var-requires */

const graphql = require("graphql-request");

const dotenvPlugin = require("cypress-dotenv");

module.exports = async (on, config) => {
  // require("cypress-mochawesome-reporter/plugin")(on); - uncomment to run reports

  config = dotenvPlugin(config, undefined, true); // read all .env variables (not only those starting from CYPRESS_)

  config.env.SHOP = await getShopInfo(config.env);

  on("before:browser:launch", ({}, launchOptions) => {
    launchOptions.args.push("--proxy-bypass-list=<-loopback>");
    return launchOptions;
  });
  return config;
};

function getShopInfo({ USER_NAME, USER_PASSWORD, API_URI }) {
  const createTokenMutation = graphql.gql`mutation tokenCreate($email: String!, $password: String!){
    tokenCreate(email:$email, password:$password){
      token
    }
  }`;

  const getShopInfoQuery = graphql.gql`query{
    shop{
      version
    }
  }`;

  const client = new graphql.GraphQLClient(API_URI, {
    headers: {},
  });

  return client
    .request(createTokenMutation, { email: USER_NAME, password: USER_PASSWORD })
    .then(data => {
      const token = data.tokenCreate.token;
      client.setHeader("Authorization", `JWT ${token}`);
      return client
        .request(getShopInfoQuery)
        .then(shopInfo => shopInfo.shop.version);
    });
}
