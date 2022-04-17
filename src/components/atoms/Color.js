/*
<Number min="0" max="1" step="0.1" relative="true" callback="()=>{}" value="0.5"/>
*/
import React from 'react';

export default class Color extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <input type="color" value={this.props.value} onChange={(e)=>{this.props.callback(e.target.value)}}></input>
    );
  }
}
