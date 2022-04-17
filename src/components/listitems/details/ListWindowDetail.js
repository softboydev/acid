/*
<Toggle useShorts="true" value="" label="Text" framerate="10" resolution="12" relative="true"/>
*/
import React from 'react';
import ListItem from "../ListItem"
import {PanelSlider,PanelToggle,PanelText} from "../../panels/panels.js"

export default class ListWindowDetail extends ListItem {
  render() {
    return (
      <React.Fragment>
      <PanelText name="Label" short="Lbl"
        target="label"
        value={this.state.label}
        callback={this.update.bind(this)} useShorts={this.props.useShorts} showButtons={this.props.showButtons} showLabels={this.props.showLabels} showTooltips={this.props.showTooltips} showInputs={this.props.showInputs}
        description="Naming label for this window"
      />
      <PanelText name="Identifier" short="Idx"
        target="short"
        value={this.state.short} max={3}
        callback={this.update.bind(this)} useShorts={this.props.useShorts} showButtons={this.props.showButtons} showLabels={this.props.showLabels} showTooltips={this.props.showTooltips} showInputs={this.props.showInputs}
        description="Three character identifier for this window"
      />
      <PanelSlider name="Resolution" short="Res"
        target="resolution"
        value={this.state.resolution}
        relative={true}
        callback={this.update.bind(this)} useShorts={this.props.useShorts} showButtons={this.props.showButtons} showLabels={this.props.showLabels} showTooltips={this.props.showTooltips} showInputs={this.props.showInputs}
        description="Sets the windows resolution"
      />
      <PanelToggle name="Relative" short="Rel"
        target="relative"
        value={this.state.relative}
        callback={this.update.bind(this)} useShorts={this.props.useShorts} showButtons={this.props.showButtons} showLabels={this.props.showLabels} showTooltips={this.props.showTooltips} showInputs={this.props.showInputs}
        description="Toggles the resolution between relative to windowsize and absolute"
      />
      <PanelSlider name="Framerate" short="Fps"
        target="framerate"
        value={this.state.framerate}
        relative={true} min={1} max={30} relative={false}
        callback={this.update.bind(this)} useShorts={this.props.useShorts} showButtons={this.props.showButtons} showLabels={this.props.showLabels} showTooltips={this.props.showTooltips} showInputs={this.props.showInputs}
        description="Sets the desired bpm to use as clocking"
      />
      </React.Fragment>
    );
  }
}
