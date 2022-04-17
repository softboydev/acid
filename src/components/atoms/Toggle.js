/*
<Toggle callback="()=>{}" value="true"/>
*/
import React from 'react';

export default class Toggle extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <label className="switch">
        <input type="checkbox" checked={this.props.value} onChange={(e)=>{this.props.callback(e.target.checked)}}></input>
        <span className="slider"></span>
      </label>
    );
  }
}
