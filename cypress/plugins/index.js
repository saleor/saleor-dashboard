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

module.exports = async (on, config) => {
  // require("cypress-mochawesome-reporter/plugin")(on);

  require("dotenv").config();

  config.env.API_URI = process.env.API_URI;
  config.env.APP_MOUNT_URI = process.env.APP_MOUNT_URI;
  config.env.SHOP = await getShopInfo(process.env);
  config.env.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
  config.env.STRIPE_PUBLIC_KEY = process.env.STRIPE_PUBLIC_KEY;
  config.env.USER_NAME = process.env.CYPRESS_USER_NAME;
  config.env.USER_PASSWORD = process.env.CYPRESS_USER_PASSWORD;
  config.env.SECOND_USER_NAME = process.env.CYPRESS_SECOND_USER_NAME;
  config.env.PERMISSIONS_USERS_PASSWORD =
    process.env.CYPRESS_PERMISSIONS_USERS_PASSWORD;
  config.env.MAILPITURL = process.env.CYPRESS_MAILPITURL;
  config.env.USER_EMAIL_SENDER = process.env.CYPRESS_USER_EMAIL_SENDER;
  config.env.USER_EMAIL_HOST = process.env.CYPRESS_USER_EMAIL_HOST;
  config.env.USER_EMAIL_PORT = process.env.CYPRESS_USER_EMAIL_PORT;
  config.env.grepTags = process.env.CYPRESS_grepTags;
  config.baseUrl = process.env.BASE_URL;
  config.env.LOCALE_CODE = process.env.LOCALE_CODE;

  on("before:browser:launch", (_browser = {}, launchOptions) => {
    launchOptions.args.push("--proxy-bypass-list=<-loopback>");
    return launchOptions;
  });

  return config;
};

function getShopInfo(envVariables) {
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

  const client = new graphql.GraphQLClient(envVariables.API_URI, {
    headers: {},
  });

  return client
    .request(createTokenMutation, {
      email: envVariables.CYPRESS_USER_NAME,
      password: envVariables.CYPRESS_USER_PASSWORD,
    })
    .then(data => {
      const token = data.tokenCreate.token;
      client.setHeader("Authorization", `JWT ${token}`);
      return client
        .request(getShopInfoQuery)
        .then(shopInfo => shopInfo.shop.version);
    });
}
