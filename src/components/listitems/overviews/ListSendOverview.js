/*
<Number min="0" max="1" step="0.1" relative="true" callback="()=>{}" value="0.5"/>
*/
import React from 'react';
import {Slider,Toggle,Option,Nametag} from "../../atoms/atoms.js"
import ListItem from "../ListItem"

export default class ListSendOverview extends ListItem {
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
      <td><Toggle callback={this.update.bind(this,"bypass")} value={this.state.bypass}/></td>
      <td>
        <Option callback={this.update.bind(this,"mix")} option={this.state.mix}
        options={["Additive","Substractive","Multiply","Divide"]}
        optionsShort={["Add","Sub","Mlt","Div"]}
        useShorts={this.props.useShorts}/>
       </td>
      </React.Fragment>
    );
  }
}
