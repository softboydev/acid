/*
<Slider min="0" max="1" step="0.1" relative="true" callback="()=>{}" value="0.5"/>
*/
import React from 'react';

export default class Slider extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <input type="range" min={this.props.min} max={this.props.max} step={this.props.step} value={Math.round(this.props.relative ? this.props.min + this.props.value * (this.props.max - this.props.min) : this.props.value)} onChange={(e)=>{this.props.callback(this.props.relative ? (e.target.value - this.props.min) / (this.props.max - this.props.min) : Number(e.target.value))}}></input>
    );
  }
}
