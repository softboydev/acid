/*
<Help description="">
*/
import React from 'react';

export default class Help extends React.Component {
  constructor(props) {
    super(props)
    this.state = {visible: false}
  }
  onMouseover (e) {
     this.setState({visible : true})
   }
   //clear the text
   onMouseout (e) {
     this.setState({visible : false})
   }
  render() {
    const {visible} = this.state
    return (
      <span>
        <button onMouseEnter={this.onMouseover.bind(this)} onMouseLeave={this.onMouseout.bind(this)}>?</button>
        {visible &&
        <span className="help">{this.props.description}</span>
        }
      </span>
    );
  }
}
