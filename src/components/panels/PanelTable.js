/*
<Slider value="" name="Name" short="XXX" useShorts="false" min="0" max="999" absolute="false" showButtons="false" showLabels="false" showTooltips="false" showInput="false" description="Description"/>,
*/
import React from 'react';
import {Nametag} from "../atoms/atoms.js"
import PanelSection from "./PanelSection.js"

export default class PanelTable extends PanelSection {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <table className="section ui">
        <thead>
          <tr>
            <th><Nametag name={this.props.name} short={this.props.short} useShorts={this.props.useShorts}/></th>
          </tr>
        </thead>
        {this.props.children}
      </table>
    );
  }
}
