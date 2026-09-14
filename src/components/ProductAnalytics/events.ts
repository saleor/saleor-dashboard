interface NavigationPinChangedProperties {
  action: "pin" | "unpin";
  result: "error" | "success";
  scope: "organization" | "user";
  target: string;
}

export interface AnalyticsEventMap {
  $pageview: {
    normalized_path: string;
  };
  contextual_link_clicked: {
    type: string;
  };
  home_onboarding_mark_all_steps_completed: undefined;
  home_onboarding_step_click: {
    step_id: string;
  };
  home_onboarding_step_complete_click: {
    step_id: string;
  };
  navigation_pin_changed: NavigationPinChangedProperties;
  "ripples.modal-opened": undefined;
}

export type AnalyticsEventName = keyof AnalyticsEventMap;

export type AnalyticsEventArguments<EventName extends AnalyticsEventName> =
  AnalyticsEventMap[EventName] extends undefined
    ? [event: EventName]
    : [event: EventName, properties: AnalyticsEventMap[EventName]];

export type TrackEvent = <EventName extends AnalyticsEventName>(
  ...args: AnalyticsEventArguments<EventName>
) => void;
