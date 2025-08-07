// @ts-strict-ignore
import React, { ReactNode } from "react";

import { Provider } from "./DateContext";

interface DateProviderState {
  date: number;
}

export class DateProvider extends React.Component<{ children: ReactNode }, DateProviderState> {
  static contextTypes = {};

  intervalId: number;

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

    return <Provider value={date}>{children}</Provider>;
  }
}
