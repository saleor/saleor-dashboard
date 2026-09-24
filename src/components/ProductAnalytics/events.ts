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
  channel_bulk_publish_completed: {
    failed_product_count: number;
    price_mode: "keep_existing" | "set_price";
    product_count: number;
    publish_enabled: boolean;
    result: "failure" | "partial_success" | "success";
    stock_enabled: boolean;
  };
  channel_bulk_publish_started: {
    price_mode: "keep_existing" | "set_price";
    product_count: number;
    publish_enabled: boolean;
    stock_enabled: boolean;
  };
  configuration_search_result_clicked: {
    input_method: "keyboard" | "mouse";
    position: number;
    result_count: number;
    result_id: string;
    result_kind: "hub" | "section" | "setting";
  };
  configuration_search_no_results: {
    query_length: "1-3" | "4-10" | "11+";
  };
  customer_type_assigned_to_customer: {
    result: "error" | "success";
  };
  customer_type_attribute_assignment_changed: {
    action: "assign" | "reorder" | "unassign";
    result: "error" | "success";
  };
  customer_type_created: {
    result: "error" | "success";
  };
  customer_type_set_as_default: {
    result: "error" | "success";
  };
  extension_installation_completed: {
    result: "error" | "success";
  };
  extension_preference_changed: {
    action: "hide" | "pin" | "show" | "unpin";
    extension_origin: "saleor" | "third_party" | "unknown";
    mount: string;
    result: "error" | "success";
    surface: "account_settings" | "entity_page" | "home";
  };
  home_onboarding_mark_all_steps_completed: undefined;
  home_onboarding_step_click: {
    step_id: string;
  };
  home_onboarding_step_complete_click: {
    step_id: string;
  };
  home_widget_opened: {
    extension_origin?: "saleor" | "third_party";
    source: "home_tab" | "sidebar";
    widget_kind: "fullscreen" | "grid";
  };
  list_filter_applied: {
    filter_count: number;
    filter_keys: string[];
    query_api_type: "filter" | "where";
  };
  list_filter_cleared: {
    query_api_type: "filter" | "where";
  };
  list_filter_preset_changed: {
    action: "deleted" | "saved" | "selected" | "updated";
    preset_kind: "built_in" | "custom";
  };
  navigation_pin_changed: NavigationPinChangedProperties;
  "ripples.modal-opened": undefined;
  setup_checklist_dismissed: {
    completed_steps: number;
    core_ready: boolean;
    entity_type: "channel" | "product";
    total_steps: number;
  };
  setup_checklist_reopened: {
    entity_type: "channel" | "product";
  };
  setup_checklist_step_clicked: {
    completed_steps: number;
    core_ready: boolean;
    entity_type: "channel" | "product";
    step_id: string;
    total_steps: number;
  };
}

export type AnalyticsEventName = keyof AnalyticsEventMap;

export type AnalyticsEventArguments<EventName extends AnalyticsEventName> =
  AnalyticsEventMap[EventName] extends undefined
    ? [event: EventName]
    : [event: EventName, properties: AnalyticsEventMap[EventName]];

export type TrackEvent = <EventName extends AnalyticsEventName>(
  ...args: AnalyticsEventArguments<EventName>
) => void;
