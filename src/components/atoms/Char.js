/*
<Char callback="()=>{}" value="C"/>
*/
import React from 'react';

export default class Char extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <input type="text" maxlength="3" value={this.props.value} onChange={(e)=>{this.props.callback(e.target.value)}}></input>
    );
  }
}
