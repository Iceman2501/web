/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Live Log component
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React, { Component } from "react";
import { animateScroll } from "react-scroll";
import { WithAPIData } from "../common/WithAPIData";
import api from "../../util/api";

export interface LiveLogProps {
  log: Array<{
    timestamp: number;
    message: string;
  }>;
  nextID: number;
}

let next = 0;
let logHistory = new Array<string>();

class LiveLog extends Component<LiveLogProps, {}> {
  componentDidUpdate() {
    this.scrollToBottom();
  }
  scrollToBottom() {
    animateScroll.scrollToBottom({
      containerId: "output",
      duration: 250,
      delay: 0,
      isDynamic: true
    });
  }

  render() {
    const { log } = this.props;

    next = this.props.nextID;

    log.map(item =>
      logHistory.push(humanTimestamp(item.timestamp) + " " + item.message)
    );

    const outputStyle = {
      width: "100%",
      height: "100%",
      "max-height": "648px"
    };

    function humanTimestamp(input: number) {
      var date = new Date(input * 1000);
      var hours = date.getHours();
      var minutes = "0" + date.getMinutes();
      var seconds = "0" + date.getSeconds();
      // Will display time in 10:30:23 format
      var formattedTime =
        hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);

      return formattedTime;
    }

    return (
      <pre id="output" style={outputStyle}>
        {logHistory.map(item => (
          <div> {item} </div>
        ))}
      </pre>
    );
  }
}

/**
 * Transform the API data into props for the component
 *
 * @param data the API data
 * @returns {*} the transformed props
 */
export const transformData = (data: ApiLiveLogData): LiveLogProps => ({
  log: data.log,
  nextID: data.nextID
});

export default (props: any) => (
  <WithAPIData
    apiCall={() => api.getLiveLog({ nextID: next })}
    repeatOptions={{ interval: 500, ignoreCancel: true }}
    renderInitial={() => null}
    renderOk={data => <LiveLog {...data} {...props} />}
    renderErr={() => null}
  />
);