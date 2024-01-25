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
import {ListEffect,ListEffectOverview,ListSend,ListSendOverview} from "../listitems.js"
import {PanelSlider,PanelText,PanelToggle,PanelOption,PanelList} from "../../panels/panels.js"
import {Nametag} from "../../atoms/atoms.js"

export default class ListLayerDetail extends ListItem {
  render() {
    return (
      <React.Fragment>
      <tr>
        <th><Nametag name="Layer" short="Lay" useShorts={this.props.useShorts}/></th>
      </tr>
      <PanelToggle name="Active" short="Act"
        target="enabled"
        value={this.state.enabled}
        callback={this.update.bind(this)} useShorts={this.props.useShorts} showButtons={this.props.showButtons} showLabels={this.props.showLabels} showTooltips={this.props.showTooltips} showInputs={this.props.showInputs}
        description="Toggles the visibility for this layer"
      />
      <PanelSlider name="Opacity" short="Opc"
        target="opacity"
        value={this.state.opacity}
        callback={this.update.bind(this)} useShorts={this.props.useShorts} showButtons={this.props.showButtons} showLabels={this.props.showLabels} showTooltips={this.props.showTooltips} showInputs={this.props.showInputs}
        description="Sets the opacity value for this layer"
      />
      <PanelText name="Label" short="Lbl"
        target="label"
        value={this.state.label}
        callback={this.update.bind(this)} useShorts={this.props.useShorts} showButtons={this.props.showButtons} showLabels={this.props.showLabels} showTooltips={this.props.showTooltips} showInputs={this.props.showInputs}
        description="Naming label for this layer"
      />
      <PanelText name="Identifier" short="Idx"
        target="short"
        value={this.state.short} max={3}
        callback={this.update.bind(this)} useShorts={this.props.useShorts} showButtons={this.props.showButtons} showLabels={this.props.showLabels} showTooltips={this.props.showTooltips} showInputs={this.props.showInputs}
        description="Three character identifier for this layer"
      />
      <tr>
        <th><Nametag name="Generator" short="Gen" useShorts={this.props.useShorts}/></th>
      </tr>
      <PanelOption name="Type" short="Typ"
        target="type"
        option={this.state.type}
        options={["Solid Patter","Stripe Pattern","Chess Pattern","Gradient","Corner Gradient","Circle Gradient","Square Wave","Saw Wave","Triangle Wave","Sine Wave","Oscilator","Perlin Algorithm","Simplex Algorithm","Organic Algorithm","Plasma Algorithm","Paths Algorithm"]}
        optionsShort={["Sld","Chs","Grd","4Gr","CGr","Sqr","Saw","Tri","Sin","Osc","Prl","Plx","Org","Pls","Pth"]}
        callback={this.update.bind(this)} useShorts={this.props.useShorts} showButtons={this.props.showButtons} showLabels={this.props.showLabels} showTooltips={this.props.showTooltips} showInputs={this.props.showInputs}
        description="Sets the layertype"
      />
      <tr>
        <th><Nametag name="Filter" short="Flt" useShorts={this.props.useShorts}/></th>
      </tr>
      <PanelSlider name="Minimum" short="Min"
        target="min"
        value={this.state.min}
        callback={this.update.bind(this)} useShorts={this.props.useShorts} showButtons={this.props.showButtons} showLabels={this.props.showLabels} showTooltips={this.props.showTooltips} showInputs={this.props.showInputs}
        description="Offset on the Z Axis"
      />
      <PanelSlider name="Maximum" short="Max"
        target="max"
        value={this.state.max}
        callback={this.update.bind(this)} useShorts={this.props.useShorts} showButtons={this.props.showButtons} showLabels={this.props.showLabels} showTooltips={this.props.showTooltips} showInputs={this.props.showInputs}
        description="Offset on the Z Axis"
      />
      <PanelSlider name="Low Pass Filter" short="Lpf"
        target="lpf"
        value={this.state.lpf}
        callback={this.update.bind(this)} useShorts={this.props.useShorts} showButtons={this.props.showButtons} showLabels={this.props.showLabels} showTooltips={this.props.showTooltips} showInputs={this.props.showInputs}
        description="Offset on the Z Axis"
      />
      <PanelSlider name="High Pass Filter" short="Hpf"
        target="hpf"
        value={this.state.hpf}
        callback={this.update.bind(this)} useShorts={this.props.useShorts} showButtons={this.props.showButtons} showLabels={this.props.showLabels} showTooltips={this.props.showTooltips} showInputs={this.props.showInputs}
        description="Offset on the Z Axis"
      />
      <tr>
        <th><Nametag name="Mixer" short="mix" useShorts={this.props.useShorts}/></th>
      </tr>
      <PanelToggle name="Bypass Mixer" short="byp"
        target="mixer"
        value={this.state.mixer}
        callback={this.update.bind(this)} useShorts={this.props.useShorts} showButtons={this.props.showButtons} showLabels={this.props.showLabels} showTooltips={this.props.showTooltips} showInputs={this.props.showInputs}
        description="Bypasses the mixer using bypass send and mode"
      />
      <PanelSlider name="Bypass Send" short="Snd"
        target="send"
        value={this.state.send}
        callback={this.update.bind(this)} useShorts={this.props.useShorts} showButtons={this.props.showButtons} showLabels={this.props.showLabels} showTooltips={this.props.showTooltips} showInputs={this.props.showInputs}
        description="Send used for all channels when bypass is active"
      />
      <PanelOption name="Bypass Mixmode" short="Mix"
        target="type"
        option={this.state.type}
        options={["Additive","Substractive","Multiply","Divide"]}
        optionsShort={["Add","Sub","Mlt","Div"]}
        callback={this.update.bind(this)} useShorts={this.props.useShorts} showButtons={this.props.showButtons} showLabels={this.props.showLabels} showTooltips={this.props.showTooltips} showInputs={this.props.showInputs}
        description="Mixmode used for all channels when bypass is active"
      />
      <PanelList name="Channels" short="Chn" tabed={true}
        target="channels"
        value={this.state.channels}
        controller={this.props.channels}
        template={ListSend} overview={ListSendOverview}  default={this.state.defaults.channel} //we are here
        callback={this.update.bind(this)} useShorts={this.props.useShorts} showButtons={this.props.showButtons} showLabels={this.props.showLabels} showTooltips={this.props.showTooltips} showInputs={this.props.showInputs}
        description="List of all mixer channels."
      />
      </React.Fragment>
    );
  }
}
