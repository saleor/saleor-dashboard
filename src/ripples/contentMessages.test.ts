import { rippleStaffOrderAlertRecipients } from "@dashboard/notificationsSettings/ripples/staffOrderAlertRecipients";
import { createElement } from "react";
import { type IntlShape, type MessageDescriptor } from "react-intl";

import { localizeRippleContent } from "./contentMessages";
import { type Ripple } from "./types";

const portuguese: Record<string, string> = {
  "New order alerts": "Avisos de novas encomendas",
  "Choose which staff members get an email when a customer places an order.":
    "Escolha os membros da equipa que recebem um e-mail quando um cliente efetua uma encomenda.",
  "Staff emails now include a New order alerts list. Assign active staff members so they are emailed when a customer completes checkout. Draft orders you complete in the Dashboard are not included.":
    "Configure os avisos de novas encomendas para a equipa.",
};

const makeIntl = (messages: Record<string, string> = portuguese) =>
  ({
    locale: "pt",
    formatMessage: ({ defaultMessage }: MessageDescriptor) =>
      (typeof defaultMessage === "string" ? messages[defaultMessage] : undefined) ?? defaultMessage,
  }) as IntlShape;

const nativeRipple: Ripple = {
  ...rippleStaffOrderAlertRecipients,
  content: Object.freeze({ ...rippleStaffOrderAlertRecipients.content }),
};

Object.freeze(nativeRipple);

describe("registered release-hint localisation", () => {
  it("translates registered native fields without changing the source or storage identity", () => {
    const before = { ...nativeRipple, content: { ...nativeRipple.content } };
    const translated = localizeRippleContent(nativeRipple, makeIntl());

    expect(translated).toEqual({
      oneLiner: "Avisos de novas encomendas",
      contextual:
        "Escolha os membros da equipa que recebem um e-mail quando um cliente efetua uma encomenda.",
      global: "Configure os avisos de novas encomendas para a equipa.",
    });
    expect(translated).not.toBe(nativeRipple.content);
    expect(nativeRipple).toEqual(before);
    expect(nativeRipple.ID).toBe("staff-order-alert-recipients");
  });

  it("keeps the original English content when no translated dictionary is provided", () => {
    expect(localizeRippleContent(nativeRipple, makeIntl({}))).toEqual(nativeRipple.content);
  });

  it("does not translate an unregistered ID even when its content matches native text", () => {
    const customRipple = {
      ...nativeRipple,
      ID: "custom-extension-announcement",
    };

    expect(localizeRippleContent(customRipple, makeIntl())).toEqual(customRipple.content);
  });

  it("preserves modified custom content under a registered ID", () => {
    const customRipple = {
      ...nativeRipple,
      content: {
        oneLiner: "Our custom title",
        contextual: "Our custom hint",
        global: "Our copy",
      },
    };

    expect(localizeRippleContent(customRipple, makeIntl())).toEqual(customRipple.content);
  });

  it("preserves rich content and only translates unchanged native string fields", () => {
    const richContent = createElement("strong", null, "Customer-authored content");
    const customRipple = {
      ...nativeRipple,
      content: { ...nativeRipple.content, contextual: richContent },
    };
    const translated = localizeRippleContent(customRipple, makeIntl());

    expect(translated.contextual).toBe(richContent);
    expect(translated.oneLiner).toBe("Avisos de novas encomendas");
    expect(customRipple.content.oneLiner).toBe(nativeRipple.content.oneLiner);
  });
});
