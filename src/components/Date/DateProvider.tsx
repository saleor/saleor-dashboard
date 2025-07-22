import React from "react";

import { DateContext } from "./DateContext";

interface DateProviderState {
  date: number;
}

// todo rewrite to hook
export class DateProvider extends React.Component<{}, DateProviderState> {
  static contextTypes = {};

  intervalId = 0;

  state = {
    date: Date.now(),
  };

  componentDidMount() {
    this.intervalId = window.setInterval(() => this.setState({ date: Date.now() }), 10000);
  }

  componentWillUnmount() {
    window.clearInterval(this.intervalId);
  }

  render() {
    const { children } = this.props;
    const { date } = this.state;

    return <DateContext.Provider value={date}>{children}</DateContext.Provider>;
  }
}
