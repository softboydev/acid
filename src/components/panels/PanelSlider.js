/*
<PanelSlider value="" relative="true" name="Name" short="XXX" useShorts="false" min="0" max="999" absolute="false" showButtons="false" showLabels="false" showTooltips="false" showInput="false" description="Description"/>,
*/
import React from 'react';
import {Nametag,Slider,Number,Button,Help} from "../atoms/atoms.js"

export default class PanelSlider extends React.Component {
  constructor(props) {
    super(props);
    // this.state = { seconds: 0 };
  }
  update(v){
    let value = v
    if(!this.absolute()){
      value = v / this.unit()
    }
    console.log(value);
    this.props.callback.apply(null,[this.props.target,value])
  }
  setToMin(){
    this.update(this.min())
  }
  setToMax(){
    this.update(this.max())
  }
  setToMid(){
    this.update((this.min() + this.max()) * 0.5)
  }
  setToRnd(){
    this.update(this.min() + Math.random() * this.max())
  }
  unit(){
    return 255
  }
  absolute(){
    return this.props.min != null && this.props.max != null
  }
  min(){
    return this.absolute() ? this.props.min : 0
  }
  max(){
    return this.absolute() ? this.props.max : this.unit()
  }
  step(){
    return this.props.relative ? 1 : this.props.step
  }
  value(){
    return this.absolute() ? this.props.value : Math.round(this.props.value * this.unit())
  }
  render() {
    return (
      <tr>
        <th>
          <Nametag name={this.props.name} short={this.props.short} useShorts={this.props.useShorts}/>
        </th>
        <td>
          <Slider min={this.min()} max={this.max()} step={this.step()} relative={this.props.relative} callback={this.update.bind(this)} value={this.value()}/>
        </td>
        {this.props.showInputs &&
        <td>
          <Number min={this.min()} max={this.max()} step={this.step()} relative={this.props.relative} callback={this.update.bind(this)} value={this.value()}/>
        </td>
        }
        {(this.props.showButtons || this.props.showTooltips) &&
        <td class="left oneline">
          {this.props.showTooltips &&
          <Help description={this.props.description}/>
          }
          {this.props.showButtons &&
          <Button callback={this.setToMin.bind(this)} icon="<"/>
          }
          {this.props.showButtons &&
          <Button callback={this.setToMid.bind(this)} icon="|"/>
          }
          {this.props.showButtons &&
          <Button callback={this.setToMax.bind(this)} icon=">"/>
          }
          {this.props.showButtons &&
          <Button callback={this.setToRnd.bind(this)} icon="*"/>
        }
        </td>
        }

      </tr>
    );
  }
}
