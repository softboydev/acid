/*
<Slider value="" name="Name" short="XXX" useShorts="false" min="0" max="999" absolute="false" showButtons="false" showLabels="false" showTooltips="false" showInput="false" description="Description"/>,
*/
import React from 'react';
import {Nametag} from "../atoms/atoms.js"

export default class PanelSection extends React.Component {
  constructor(props) {
    super(props);
  }
  toggle() {

  }
  render() {
    return (
      <tbody>
        <tr>
          <th><Nametag name={this.props.name} short={this.props.short} useShorts={this.props.useShorts}/></th>
        </tr>
        {this.props.children}
      </tbody>
    );
  }
}
