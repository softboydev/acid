/*
<Option callback="()=>{}" option=0 options=[] optionsShort=[]/>
*/
import React from 'react';

export default class Option extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <span style={{cursor:"pointer",userSelect:"none"}}onClick={(e)=>{this.props.callback((this.props.option + 1) % this.props.options.length)}}>{this.props.useShorts ? this.props.optionsShort[this.props.option] : this.props.options[this.props.option]}</span>
    );
  }
}
