/*
<Toggle useShorts="true" value="" label="Text" framerate="10" resolution="12" relative="true"/>
*/
// label: "Channel", //uilabel
// min: 0, //minimum value
// max: 1, //max value
// mod: 1, //allowed mod between min and max
// clp: 0, //clipping mode
import React from 'react';
import {PanelSlider,PanelOption,PanelText} from "../panels/panels.js"
import Module from "./Module"

export default class ModuleGenerator extends Module {
  render() {
    return (
      <React.Fragment>
      <PanelSlider name="Frequency" short="Frq"
        target="frequency"
        value={this.state.value.frequency}
        relative={true}
        callback={this.update.bind(this)} useShorts={this.props.useShorts} showButtons={this.props.showButtons} showLabels={this.props.showLabels} showTooltips={this.props.showTooltips} showInputs={this.props.showInputs}
        description="Sets the amount of allowed modulation between min and max value"
      />
      <PanelOption name="Type" short="Typ"
        target="type"
        option={this.state.type}
        options={["Triangle","Square","Sine"]}
        optionsShort={["Tri","Sqr","Sin"]}
        callback={this.update.bind(this)} useShorts={this.props.useShorts} showButtons={this.props.showButtons} showLabels={this.props.showLabels} showTooltips={this.props.showTooltips} showInputs={this.props.showInputs}
        description="Sets the clipping behaviour for this channel"
      />
      </React.Fragment>
    );
  }
}
