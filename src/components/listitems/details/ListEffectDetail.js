/*
<Number min="0" max="1" step="0.1" relative="true" callback="()=>{}" value="0.5"/>
*/
import React from 'react';
import {PanelToggle,PanelOption,PanelSlider} from "../../panels/panels"
import ListItem from "../ListItem"

export default class ListEffectDetail extends ListItem {
  render() {
    return (
      <React.Fragment>
      <PanelOption name="Effect Type" short="Typ"
        target="type"
        option={this.state.type}
        options={["Amplifier","Attenuator","Compressor","Extender","Bitcrusher","Randomizer"]}
        optionsShort={["Amp","Att","Cmp","Ext","Bit","Rnd"]}
        callback={this.update.bind(this)} useShorts={this.props.useShorts} showButtons={this.props.showButtons} showLabels={this.props.showLabels} showTooltips={this.props.showTooltips} showInputs={this.props.showInputs}
        description="Effect type, choose between linear, dynamic and non-linear effects"
      />
      <PanelToggle name="Bypass" short="Byp"
        target="bypass"
        value={this.state.bypass}
        callback={this.update.bind(this)} useShorts={this.props.useShorts} showTooltips={this.props.showTooltips}
        description="Toggles the bypass"
      />
      <PanelSlider name="Send" short="Snd"
        target="send"
        value={this.state.send}
        callback={this.update.bind(this)} useShorts={this.props.useShorts} showButtons={this.props.showButtons} showLabels={this.props.showLabels} showTooltips={this.props.showTooltips} showInputs={this.props.showInputs}
        description="Sets the desired send into the effect"
      />
      </React.Fragment>
    );
  }
}
