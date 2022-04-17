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
import {PanelSlider,PanelOption,PanelText} from "../../panels/panels.js"

export default class ListChannelDetail extends ListItem {
  render() {
    return (
      <React.Fragment>
      <PanelText name="Label" short="Lbl"
        target="label"
        value={this.state.label}
        callback={this.update.bind(this)} useShorts={this.props.useShorts} showButtons={this.props.showButtons} showLabels={this.props.showLabels} showTooltips={this.props.showTooltips} showInputs={this.props.showInputs}
        description="Naming label for this channel"
      />
      <PanelText name="Identifier" short="Idx"
        target="short"
        value={this.state.short} max={3}
        callback={this.update.bind(this)} useShorts={this.props.useShorts} showButtons={this.props.showButtons} showLabels={this.props.showLabels} showTooltips={this.props.showTooltips} showInputs={this.props.showInputs}
        description="Three character identifier for this channel"
      />
      <PanelSlider name="Minimum" short="Min"
        target="min"
        value={this.state.min}
        callback={this.update.bind(this)} useShorts={this.props.useShorts} showButtons={this.props.showButtons} showLabels={this.props.showLabels} showTooltips={this.props.showTooltips} showInputs={this.props.showInputs}
        description="Sets the floor value for the channel"
      />
      <PanelSlider name="Maximum" short="Max"
        target="max"
        value={this.state.max}
        callback={this.update.bind(this)} useShorts={this.props.useShorts} showButtons={this.props.showButtons} showLabels={this.props.showLabels} showTooltips={this.props.showTooltips} showInputs={this.props.showInputs}
        description="Sets the ceiling value for the channel"
      />
      <PanelSlider name="Modulation" short="Mod"
        target="mod"
        value={this.state.mod}
        callback={this.update.bind(this)} useShorts={this.props.useShorts} showButtons={this.props.showButtons} showLabels={this.props.showLabels} showTooltips={this.props.showTooltips} showInputs={this.props.showInputs}
        description="Sets the amount of allowed modulation between min and max value"
      />
      <PanelOption name="Clipping" short="Clp"
        target="clipping"
        option={this.state.clipping}
        options={["Reset","Digital","Analog","Modify"]}
        optionsShort={["Rst","Dig","Anl","Mod"]}
        callback={this.update.bind(this)} useShorts={this.props.useShorts} showButtons={this.props.showButtons} showLabels={this.props.showLabels} showTooltips={this.props.showTooltips} showInputs={this.props.showInputs}
        description="Sets the clipping behaviour for this channel"
      />
      </React.Fragment>
    );
  }
}
