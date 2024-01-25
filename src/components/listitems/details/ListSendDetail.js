/*
<Number min="0" max="1" step="0.1" relative="true" callback="()=>{}" value="0.5"/>
*/
import React from 'react';
import {Nametag} from "../../atoms/atoms.js"
import {PanelToggle,PanelOption,PanelSlider} from "../../panels/panels"
import ListItem from "../ListItem"

export default class ListSendDetail extends ListItem {
  static getDerivedStateFromProps(props, state) {
    if(props.label != state.label || props.short != state.short){
      return {
        short: props.short,
        label: props.label
      }
    }
    return null
  }
  render() {
    return (
      <React.Fragment>
      <td><Nametag name={this.state.label} short={this.state.short} useShorts={this.props.useShorts}/></td>
      <PanelOption name="Effect Type" short="Typ"
        target="mix"
        option={this.state.mix}
        options={["Additive","Substractive","Multiply","Divide"]}
        optionsShort={["Add","Sub","Mlt","Div"]}
        callback={this.update.bind(this)} useShorts={this.props.useShorts} showButtons={this.props.showButtons} showLabels={this.props.showLabels} showTooltips={this.props.showTooltips} showInputs={this.props.showInputs}
        description="Mixing type for this channel"
      />
      <PanelToggle name="Bypass" short="Byp"
        target="bypass"
        value={this.state.bypass}
        callback={this.update.bind(this)} useShorts={this.props.useShorts} showTooltips={this.props.showTooltips}
        description="Toggles the bypass for this channel"
      />
      <PanelSlider name="Send" short="Snd"
        target="send"
        value={this.state.send}
        callback={this.update.bind(this)} useShorts={this.props.useShorts} showButtons={this.props.showButtons} showLabels={this.props.showLabels} showTooltips={this.props.showTooltips} showInputs={this.props.showInputs}
        description="Sets the desired send into the channel"
      />
      </React.Fragment>
    );
  }
}
