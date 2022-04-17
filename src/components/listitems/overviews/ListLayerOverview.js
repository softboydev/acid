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
import {Toggle,Slider,Text,Help} from "../../atoms/atoms.js"

export default class ListLayerOverviw extends ListItem {
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
      <td>
        <Toggle callback={this.update.bind(this,"enabled")} value={this.state.enabled}/>
      </td>
      <td>
        <Slider min={0} max={999} step={1} relative={true} callback={this.update.bind(this,"opacity")} value={this.state.opacity}/>
      </td>
      {(this.props.showButtons || this.props.showTooltips) &&
        <td>
          {this.props.showTooltips &&
          <Help description="Rename, change visibility and opacity from here, click edit for all parameters"/>
          }
        </td>
      }
      </tr>
    );
  }
}