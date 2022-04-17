/*
<Toggle useShorts="true" value="" label="Text" framerate="10" resolution="12" relative="true"/>
*/
// label: "Channel", //uilabel
// min: 0, //minimum value
// max: 1, //max value
// mod: 1, //allowed mod between min and max
// clp: 0, //clipping mode
import React from 'react';
import ListItem from "../ListItem"
import {Text,Help} from "../../atoms/atoms.js"

export default class ListChannelOverview extends ListItem {
  render() {
    return (
      <tr>
      <td>
      {this.props.useShort &&
        <Text callback={this.update.bind(this,"label")} max={30} value={this.state.label}/>
      }
      {!this.props.useShort &&
        <Text callback={this.update.bind(this,"short")} max={3} value={this.state.short}/>
      }
      </td>
      {(this.props.showButtons || this.props.showTooltips) &&
        <td>
          {this.props.showTooltips &&
          <Help description="A channel is used by all layers to pipe their generators to the render engine"/>
          }
        </td>
      }
      </tr>
    );
  }
}
