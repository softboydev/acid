/*
<Number min="0" max="1" step="0.1" relative="true" callback="()=>{}" value="0.5"/>
*/
import React from 'react';
import {Slider,Toggle,Option} from "../../atoms/atoms.js"
import ListItem from "../ListItem"

export default class ListEffectOverview extends ListItem {
  render() {
    console.log(this.state);
    return (
      <React.Fragment>
      <td><Toggle callback={this.update.bind(this,"bypass")} value={this.state.bypass}/></td>
      <td><Option callback={this.update.bind(this,"type")} option={this.state.type} options={["Amplifier","Attenuator","Compressor","Extender","Bitcrusher","Randomizer"]} optionsShort={["Amp","Att","Cmp","Ext","Bit","Rnd"]} useShorts={this.props.useShorts}/></td>
      </React.Fragment>
    );
  }
}
