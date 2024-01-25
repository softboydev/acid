/*
<Text callback="()=>{}" value="text"/>
*/
import React from 'react';

export default class Text extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <input type="text" maxlength={this.props.max || 100} value={this.props.value} onChange={(e)=>{this.props.callback(e.target.value)}}></input>
    );
  }
}
