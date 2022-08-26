import { stripeConfirmationUrl, urlList } from "../../../fixtures/urlList";
import { getValueWithDefault } from "./utils/Utils";

const stripeAuthBearer = `Bearer ${Cypress.env("STRIPE_SECRET_KEY")}`;
const stripePublicKey = Cypress.env("STRIPE_PUBLIC_KEY");

export function getPaymentMethodStripeId({
  cardNumber,
  cvc,
  expMonth,
  expYear,
}) {
  return cy.request({
    url: urlList.stripeApiPaymentMethods,
    method: "POST",
    form: true,
    body: {
      type: "card",
      "card[number]": cardNumber,
      "card[cvc]": cvc,
      "card[exp_month]": expMonth,
      "card[exp_year]": expYear,
      pasted_fields: "number",
      key: stripePublicKey,
    },
    headers: {
      Authorization: stripeAuthBearer,
    },
  });
}

export function sendConfirmationToStripe(paymentMethodId, confirmationId) {
  return cy.request({
    method: "POST",
    url: stripeConfirmationUrl(confirmationId),
    form: true,
    failOnStatusCode: false,
    headers: {
      Authorization: stripeAuthBearer,
    },
    body: {
      payment_method: paymentMethodId,
      return_url: Cypress.config().baseUrl,
      webauthn_uvpa_available: "true",
      spc_eligible: "false",
      key: stripePublicKey,
    },
  });
}

export function confirmThreeDSecure(nextActionUrl, withSuccess = true) {
  let returnUrl;
  const paRes = getValueWithDefault(withSuccess, "success", "failure");

  return cy
    .request(nextActionUrl)
    .then(resp => {
      const { body } = new DOMParser().parseFromString(resp.body, "text/html");
      const formUrl = body.querySelector('[id="form"]').getAttribute("action");
      const source = body
        .querySelector('[name="source_slug"]')
        .getAttribute("value");
      returnUrl = body
        .querySelector('[name="return_url"]')
        .getAttribute("value");
      const amount = body
        .querySelector('[name="amount"]')
        .getAttribute("value");
      const currency = body
        .querySelector('[name="currency"]')
        .getAttribute("value");
      const usage = body.querySelector('[name="usage"]').getAttribute("value");

      const url = `${formUrl}?source_slug=${source}&livemode=false&type=three_d_secure&pass_through=&return_url=${returnUrl}&amount=${amount}&currency=
    ${currency}&usage=${usage}`;
      cy.request(url);
    })
    .then(() => {
      cy.request({
        url: returnUrl,
        method: "POST",
        form: true,
        body: {
          PaRes: "success",
          MD: "",
        },
      });
    })
    .then(resp => {
      const { body } = new DOMParser().parseFromString(resp.body, "text/html");
      const formUrl = body.querySelector('[id="form"]').getAttribute("action");
      const merchant = body
        .querySelector('[name="merchant"]')
        .getAttribute("value");
      cy.request({
        url: formUrl,
        method: "POST",
        form: true,
        body: {
          PaRes: paRes,
          MD: "",
          Merchant: merchant,
        },
      });
    });
}
