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
      <PanelSlider name="Frequency" short="Frq"
        target="frequency"
        value={this.state.frequency}
        callback={this.update.bind(this)} useShorts={this.props.useShorts} showButtons={this.props.showButtons} showLabels={this.props.showLabels} showTooltips={this.props.showTooltips} showInputs={this.props.showInputs}
        description="Sets the repeat frequency"
      />
      <PanelSlider name="Offset" short="Off"
        target="offset"
        value={this.state.offset}
        callback={this.update.bind(this)} useShorts={this.props.useShorts} showButtons={this.props.showButtons} showLabels={this.props.showLabels} showTooltips={this.props.showTooltips} showInputs={this.props.showInputs}
        description="Sets the fixed offset between 0 and the frequency"
      />
      <PanelSlider name="Drift" short="Det"
        target="drift"
        value={this.state.drift}
        callback={this.update.bind(this)} useShorts={this.props.useShorts} showButtons={this.props.showButtons} showLabels={this.props.showLabels} showTooltips={this.props.showTooltips} showInputs={this.props.showInputs}
        description="Sets the linear consistent drift bidirectioanl"
      />
      <PanelSlider name="Rotation" short="Rot"
        target="rotation"
        value={this.state.rotation}
        callback={this.update.bind(this)} useShorts={this.props.useShorts} showButtons={this.props.showButtons} showLabels={this.props.showLabels} showTooltips={this.props.showTooltips} showInputs={this.props.showInputs}
        description="Sets the visual 2D rotation"
      />
      <tr>
        <th><Nametag name="Waveshape" short="Wav" useShorts={this.props.useShorts}/></th>
      </tr>
      <PanelSlider name="Shape" short="Shp"
        target="shape"
        value={this.state.shape}
        callback={this.update.bind(this)} useShorts={this.props.useShorts} showButtons={this.props.showButtons} showLabels={this.props.showLabels} showTooltips={this.props.showTooltips} showInputs={this.props.showInputs}
        description="Sets the waveshape"
      />
      <PanelSlider name="Center" short="Cen"
        target="center"
        value={this.state.center}
        callback={this.update.bind(this)} useShorts={this.props.useShorts} showButtons={this.props.showButtons} showLabels={this.props.showLabels} showTooltips={this.props.showTooltips} showInputs={this.props.showInputs}
        description="Sets the waveshapes center"
      />
      <tr>
        <th><Nametag name="Translation" short="Trn" useShorts={this.props.useShorts}/></th>
      </tr>
      <PanelSlider name="X Frequency" short="XFr"
        target="xfrequency"
        value={this.state.xfrequency}
        callback={this.update.bind(this)} useShorts={this.props.useShorts} showButtons={this.props.showButtons} showLabels={this.props.showLabels} showTooltips={this.props.showTooltips} showInputs={this.props.showInputs}
        description="Frequency on the X Axis"
      />
      <PanelSlider name="X Offset" short="XOf"
        target="xoffset"
        value={this.state.xoffset}
        callback={this.update.bind(this)} useShorts={this.props.useShorts} showButtons={this.props.showButtons} showLabels={this.props.showLabels} showTooltips={this.props.showTooltips} showInputs={this.props.showInputs}
        description="Offset on the X Axis"
      />
      <PanelSlider name="Y Frequency" short="YFr"
        target="yfrequency"
        value={this.state.yfrequency}
        callback={this.update.bind(this)} useShorts={this.props.useShorts} showButtons={this.props.showButtons} showLabels={this.props.showLabels} showTooltips={this.props.showTooltips} showInputs={this.props.showInputs}
        description="Frequency on the Y Axis"
      />
      <PanelSlider name="Y Offset" short="YOf"
        target="yoffset"
        value={this.state.yoffset}
        callback={this.update.bind(this)} useShorts={this.props.useShorts} showButtons={this.props.showButtons} showLabels={this.props.showLabels} showTooltips={this.props.showTooltips} showInputs={this.props.showInputs}
        description="Offset on the Y Axis"
      />
      <PanelSlider name="Z Frequency" short="ZFr"
        target="zfrequency"
        value={this.state.zfrequency}
        callback={this.update.bind(this)} useShorts={this.props.useShorts} showButtons={this.props.showButtons} showLabels={this.props.showLabels} showTooltips={this.props.showTooltips} showInputs={this.props.showInputs}
        description="Frequency on the Z Axis"
      />
      <PanelSlider name="Z Offset" short="ZOf"
        target="zoffset"
        value={this.state.zoffset}
        callback={this.update.bind(this)} useShorts={this.props.useShorts} showButtons={this.props.showButtons} showLabels={this.props.showLabels} showTooltips={this.props.showTooltips} showInputs={this.props.showInputs}
        description="Offset on the Z Axis"
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
      <tr>
        <th><Nametag name="Effects" short="Efx" useShorts={this.props.useShorts}/></th>
      </tr>
      <PanelToggle name="Bypass Effects" short="byp"
        target="effects"
        value={this.state.effects}
        callback={this.update.bind(this)} useShorts={this.props.useShorts} showButtons={this.props.showButtons} showLabels={this.props.showLabels} showTooltips={this.props.showTooltips} showInputs={this.props.showInputs}
        description="Bypasses all effect inserts"
      />
      <PanelSlider name="Dry/Wet" short="D/W"
        target="drywet"
        value={this.state.drywet}
        callback={this.update.bind(this)} useShorts={this.props.useShorts} showButtons={this.props.showButtons} showLabels={this.props.showLabels} showTooltips={this.props.showTooltips} showInputs={this.props.showInputs}
        description="Blends between dry and effected signal"
      />
      <PanelList name="Effects" short="Efx" tabed={true}
        target="inserts"
        value={this.state.inserts}
        template={ListEffect} overview={ListEffectOverview} default={this.state.defaults.effect} //we are here
        callback={this.update.bind(this)} useShorts={this.props.useShorts} showButtons={this.props.showButtons} showLabels={this.props.showLabels} showTooltips={this.props.showTooltips} showInputs={this.props.showInputs}
        description="List of all effect inserts."
      />
      </React.Fragment>
    );
  }
}
