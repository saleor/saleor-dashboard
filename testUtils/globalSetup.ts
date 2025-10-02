module.exports = function () {
  process.env.TZ = "UTC";

  jest.mock("react-intl");
};
